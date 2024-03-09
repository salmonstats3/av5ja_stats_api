import { HttpModule } from '@nestjs/axios'
import { Test, TestingModule } from '@nestjs/testing'

import { ResourcesService } from '@/resources/resources.service'

describe('ResourceService', () => {
  let service: ResourcesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [ResourcesService],
    }).compile()

    service = module.get<ResourcesService>(ResourcesService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
