import Joi from 'joi'
import { isBuildStatus } from '../build-status.js'
import { createServiceTester } from '../tester.js'
export const t = await createServiceTester()

t.create('build status on default branch')
  .get('/com/ivandelabeldad/rackian-gateway.json')
  .expectBadge({
    label: 'build',
    message: Joi.alternatives().try(isBuildStatus, Joi.equal('unknown')),
  })

t.create('build status on named branch')
  .get('/com/ivandelabeldad/rackian-gateway.json')
  .expectBadge({
    label: 'build',
    message: Joi.alternatives().try(isBuildStatus, Joi.equal('unknown')),
  })

t.create('unknown repo')
  .get('/com/this-repo/does-not-exist.json')
  .expectBadge({ label: 'build', message: 'unknown' })

t.create('invalid svg response')
  .get('/com/foo/bar.json')
  .intercept(nock =>
    nock('https://api.travis-ci.com').get('/foo/bar.svg').reply(200),
  )
  .expectBadge({ label: 'build', message: 'unparseable svg response' })
