import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

import v20240301 from '@/../test/results/20240301.json'

describe('AppController (e2e)', () => {
  beforeAll(() => {
    dayjs.extend(utc)
    dayjs.extend(timezone)
    dayjs.tz.setDefault('Asia/Tokyo')
  })

  it('Results Controller', () => {
    expect(v20240301).toBeDefined()
  })
})
