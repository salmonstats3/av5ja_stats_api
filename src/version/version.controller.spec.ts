import { HttpModule } from '@nestjs/axios'
import { CacheModule } from '@nestjs/cache-manager'
import { Test, TestingModule } from '@nestjs/testing'

import { VersionController } from '@/version/version.controller'
import { VersionService } from '@/version/version.service'

describe('VersionController', () => {
  let controller: VersionController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VersionController],
      imports: [HttpModule, CacheModule.register()],
      providers: [VersionService],
    }).compile()

    controller = module.get<VersionController>(VersionController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
