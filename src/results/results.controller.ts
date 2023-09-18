import { Body, Controller, Post } from "@nestjs/common";

import { ResultsService } from "./results.service";

@Controller("results")
export class ResultsController {
  constructor(private readonly service: ResultsService) {}

  @Post()
  async create(@Body() request: any) {
    console.log(request);
  }
}
