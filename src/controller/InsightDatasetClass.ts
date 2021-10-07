import {InsightDataset, InsightDatasetKind} from "./IInsightFacade";

export class InsightDatasetClass implements InsightDataset {
	public courses!: JSON[];
	public id!: string;
	public kind!: InsightDatasetKind;
	public numRows!: number;
	constructor(id: string, kind: InsightDatasetKind, courses: JSON[]) {
		this.courses = courses;
		this.id = id;
		this.kind = kind;
		this.numRows = courses.length;
	}
}
