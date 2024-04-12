import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import timezoneMock from 'timezone-mock'

import { Common } from '@/dto/common'
import { CoopSchedule } from '@/dto/coop_schedule'

describe('AppController (e2e)', () => {
  beforeAll(() => {
    dayjs.extend(utc)
    dayjs.extend(timezone)
    dayjs.tz.setDefault('Asia/Tokyo')
    timezoneMock.register('UTC')
  })

  const results: string[] = [
    'Q29vcEhpc3RvcnlEZXRhaWwtdS1hN2dyejY1cnhrdmhmc2J3bXhtbToyMDI0MDMxOVQxNTE5MjNfZDMxMzllM2EtOWVhYy00MTNlLWE2MDQtZTEzMTM0ZmNmNmZm',
    'Q29vcEhpc3RvcnlEZXRhaWwtdS1hN2dyejY1cnhrdmhmc2J3bXhtbToyMDI0MDMxOVQxNTEzNTdfN2E1NTE0ZjMtOGViNi00MzRiLWJmMWEtNjc0ZDA0YmEyODVj',
    'Q29vcEhpc3RvcnlEZXRhaWwtdS1hN2dyejY1cnhrdmhmc2J3bXhtbToyMDI0MDMxOVQxNTAzMThfODEzNTU2MjAtYjRhZi00MWI0LThjYmMtMDY0MjY3MWZiMDlj',
    'Q29vcEhpc3RvcnlEZXRhaWwtdS1hN2dyejY1cnhrdmhmc2J3bXhtbToyMDI0MDMxOVQxNDU1MzRfNDZiMGUwNzAtZDdiMS00MDBkLTlmNDItYTliMmRkMTkwNDNj',
    'Q29vcEhpc3RvcnlEZXRhaWwtdS1hN2dyejY1cnhrdmhmc2J3bXhtbToyMDI0MDMxOVQxNDQ4MDlfZTlmNGE5Y2MtZTIyYS00ODMzLTk4YjgtNGFkOGZjYzNmYTgw',
    'Q29vcEhpc3RvcnlEZXRhaWwtdS1hN2dyejY1cnhrdmhmc2J3bXhtbToyMDI0MDMxOVQxNDQwNDZfNjhjZGEyNGUtYzkwYy00NGUwLTgzZTMtNDVkM2JmMDM3MTRh',
    'Q29vcEhpc3RvcnlEZXRhaWwtdS1hN2dyejY1cnhrdmhmc2J3bXhtbToyMDI0MDMxOVQxNDMxMjJfZDk4NTFlODUtZWZmYS00ZDFmLWJiNWItZDBmNzA5NTVkNWZk',
    'Q29vcEhpc3RvcnlEZXRhaWwtdS1hN2dyejY1cnhrdmhmc2J3bXhtbToyMDI0MDMxOVQxNDI1NDdfMDZjZWFmZDktZTcxMS00YmVjLWEwYTYtYzc3NmM2MTViOGYx',
    'Q29vcEhpc3RvcnlEZXRhaWwtdS1hN2dyejY1cnhrdmhmc2J3bXhtbToyMDI0MDMxOVQxNDE4MTRfYzI2MzdkZmUtMjBiMC00YjI2LWFjMTktNDI5Y2FmMGQzZDYx',
    'Q29vcEhpc3RvcnlEZXRhaWwtdS1hN2dyejY1cnhrdmhmc2J3bXhtbToyMDI0MDMxOVQxNDEwNTFfNzE3NWU1YzUtZmJmZC00OTdhLTllNjUtYjIyZDY0ZDc2MmJi',
    'Q29vcEhpc3RvcnlEZXRhaWwtdS1hN2dyejY1cnhrdmhmc2J3bXhtbToyMDI0MDMxOVQxNDAzMzBfYzFhZWRmZmEtMWQzYS00MDcwLWI0NGItMjMxMmVjMmQwODg2',
    'Q29vcEhpc3RvcnlEZXRhaWwtdS1hN2dyejY1cnhrdmhmc2J3bXhtbToyMDI0MDMxOVQxMzUxNDdfN2VkZWU0ZGUtZDhmOC00M2JlLWE0YmItMDUxNjEzNjYxZjYy',
    'Q29vcEhpc3RvcnlEZXRhaWwtdS1hN2dyejY1cnhrdmhmc2J3bXhtbToyMDI0MDMxOVQxMzQ0MTZfYmIzYThmMzAtZmY2ZC00YWU0LWFlMzMtMmJmNDE5MDM5ZDgy',
    'Q29vcEhpc3RvcnlEZXRhaWwtdS1hN2dyejY1cnhrdmhmc2J3bXhtbToyMDI0MDMxOVQxMzM4NTVfZDQ0NWU0NDUtODY4YS00NDg0LWIwMDQtMTliNGQwZTY3ZjEz',
    'Q29vcEhpc3RvcnlEZXRhaWwtdS1hN2dyejY1cnhrdmhmc2J3bXhtbToyMDI0MDMxOVQxMzMxMjlfYzgxZTU0OWItOTE2My00ODBmLWJkNzMtNmZiNDlmNmU1ZmRl',
    'Q29vcEhpc3RvcnlEZXRhaWwtdS1hN2dyejY1cnhrdmhmc2J3bXhtbToyMDI0MDMxOVQxMzI0MDNfMzllYmVjZTgtNTk5Zi00ZGYzLTgyYzktZjdmZDIzZTJlZjBl',
    'Q29vcEhpc3RvcnlEZXRhaWwtdS1hN2dyejY1cnhrdmhmc2J3bXhtbToyMDI0MDMxOVQxMzE2MjdfYTA1NDUzMjItZTFhZC00NWRlLWE5ZjAtZjQ4OTcxNDAxMzVi',
  ]

  it('should return results', () => {
    const schedule: CoopSchedule = CoopSchedule.from({
      endTime: '2024-03-11T00:00:00Z',
      mode: 'REGULAR',
      rareWeapons: [],
      rule: 'BIG_RUN',
      stage: 106,
      startTime: '2024-03-09T00:00:00Z',
      weapons: [-1, -1, -1, -1],
    })
    expect(schedule.id).toEqual('c4636ed5f059b234580fed850af04eee')
    results.forEach((result: string) => {
      const id: Common.ResultId = Common.ResultId.from(result)
      expect(id.rawValue).toEqual(result)
    })
  })
})
