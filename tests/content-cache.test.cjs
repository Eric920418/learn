const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const ts = require('typescript')

function load(file, mocks) {
  const module = { exports: {} }
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText
  vm.runInNewContext(code, { module, exports: module.exports, Error, require: id => {
    assert.ok(id in mocks, `Unexpected dependency: ${id}`)
    return mocks[id]
  } })
  return module.exports
}

test('CMS changes invalidate public caches only after authorization and successful writes', async () => {
  const events = []
  let authorized = true, fail = false
  const write = async () => {
    events.push('save')
    if (fail) throw new Error('save failed')
    return [{ id: 'album' }]
  }
  const chain = {
    values: () => ({ then: (resolve, reject) => write().then(resolve, reject), returning: write }),
    set: () => ({ where: write }),
    where: write,
  }
  const mocks = {
    'next/cache': {
      updateTag: tag => events.push(['tag', tag]),
      revalidatePath: (...args) => events.push(['path', ...args]),
    },
    '@/lib/db': { db: {
      insert: () => chain, update: () => chain, delete: () => chain,
      select: () => ({ from: () => ({ limit: async () => [{ id: 'settings' }] }) }),
    } },
    '@/lib/db/schema': { associationMembers: { id: 'id' }, siteSettings: { id: 'id' }, galleryAlbums: { id: 'id' }, galleryPhotos: { id: 'id' } },
    'drizzle-orm': { eq: () => undefined },
    './auth-check': { requireAdmin: async () => {
      if (!authorized) throw new Error('unauthorized')
    } },
    '@vercel/blob': { del: async () => assert.fail('No Blob changes expected') },
    '@/lib/upload': {},
  }
  const members = load('src/lib/actions/members.ts', mocks)
  const settings = load('src/lib/actions/settings.ts', mocks)
  const gallery = load('src/lib/actions/gallery.ts', mocks)
  const form = { get: key => key === 'id' ? 'album' : '' }
  const operations = [
    [() => members.createMember(form), ['tag', 'public-members']],
    [() => members.updateMember(form), ['tag', 'public-members']],
    [() => members.deleteMember('member'), ['tag', 'public-members']],
    [() => settings.updateSiteSettings(form), ['tag', 'site-settings']],
    [() => gallery.createAlbum(form), ['path', '/gallery/[id]', 'page']],
    [() => gallery.updatePhoto(form), ['path', '/gallery']],
  ]
  for (const [operation, expected] of operations) {
    events.length = 0; authorized = true; fail = false
    assert.equal((await operation()).success, true)
    assert.equal(events[0], 'save')
    assert.ok(events.some(event => JSON.stringify(event) === JSON.stringify(expected)))
    if (expected[1] === 'site-settings') {
      assert.ok(events.some(event => JSON.stringify(event) === JSON.stringify(['path', '/', 'layout'])))
    }
    events.length = 0; fail = true
    assert.match((await operation()).error, /save failed/)
    assert.deepEqual(events, ['save'])
    events.length = 0; authorized = false
    assert.match((await operation()).error, /unauthorized/)
    assert.deepEqual(events, [])
  }
})
