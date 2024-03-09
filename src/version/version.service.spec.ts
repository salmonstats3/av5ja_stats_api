import { HttpModule } from '@nestjs/axios'
import { Test, TestingModule } from '@nestjs/testing'

import { VersionService } from '@/version/version.service'

describe('VersionService', () => {
  let service: VersionService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [VersionService],
    }).compile()

    service = module.get<VersionService>(VersionService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
