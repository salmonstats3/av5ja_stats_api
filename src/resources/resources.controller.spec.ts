import { HttpModule } from '@nestjs/axios'
import { CacheModule } from '@nestjs/cache-manager'
import { Test, TestingModule } from '@nestjs/testing'

import { ResourcesController } from '@/resources/resources.controller'
import { ResourcesService } from '@/resources/resources.service'

describe('ResourcesController', () => {
  let controller: ResourcesController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResourcesController],
      imports: [HttpModule, CacheModule.register()],
      providers: [ResourcesService],
    }).compile()

    controller = module.get<ResourcesController>(ResourcesController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
