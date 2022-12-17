export class CoopResultCreateResponse {
  id: string;
  salmonId: number;

  constructor(id: string, salmonId: number) {
    this.id = id;
    this.salmonId = salmonId;
  }
}
