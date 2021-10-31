import {IInsightFacade, InsightDatasetKind} from "../../src/controller/IInsightFacade";
import InsightFacade from "../../src/controller/InsightFacade";
import {getContentFromArchives} from "../resources/TestUtil";
import * as fs from "fs-extra";
import {isValidApply, isValidQuery} from "../../src/controller/ValidateQuery";
import {group, sortByKeys} from "../../src/controller/performQuery Helpers";

describe("tests", function() {
	let courses: string;
	let courses16: string;
	let courses10: string;
	let courses8: string;
	let coursesNotAllJson: string;
	let coursesJsonOutsideFolder: string;
	before(function () {
		courses = getContentFromArchives("courses.zip");
		courses16 = getContentFromArchives("courses_16.zip");
		courses10 = getContentFromArchives("courses_10.zip");
		courses8 = getContentFromArchives("courses_8.zip");
		coursesNotAllJson = getContentFromArchives("not_all_json.zip");
		coursesJsonOutsideFolder = getContentFromArchives("courses_only_64612_should_be_considered.zip");
	});
	describe("Tutorial add 0/1/multi DS", function () {
		let facade: IInsightFacade = new InsightFacade();
		let q = [
			{
				courses_dept: "thtr",
				courses_year: 2014
			},
			{
				courses_dept: "thtr",
				courses_year: 2011
			},
			{
				courses_dept: "thtr",
				courses_year: 1900
			},
			{
				courses_dept: "thtr",
				courses_year: 1900
			},
			{
				courses_dept: "surg",
				courses_year: 2013
			},
			{
				courses_dept: "surg",
				courses_year: 2011
			},
			{
				courses_dept: "surg",
				courses_year: 1900
			},
			{
				courses_dept: "surg",
				courses_year: 1900
			},
			{
				courses_dept: "stat",
				courses_year: 2014
			},
			{
				courses_dept: "stat",
				courses_year: 1900
			},
			{
				courses_dept: "spph",
				courses_year: 2015
			},
			{
				courses_dept: "spph",
				courses_year: 2015
			},
			{
				courses_dept: "spph",
				courses_year: 2015
			},
			{
				courses_dept: "spph",
				courses_year: 2015
			},
			{
				courses_dept: "spph",
				courses_year: 2015
			},
			{
				courses_dept: "spph",
				courses_year: 2015
			},
			{
				courses_dept: "spph",
				courses_year: 2015
			},
			{
				courses_dept: "spph",
				courses_year: 2014
			},
			{
				courses_dept: "spph",
				courses_year: 2014
			},
			{
				courses_dept: "spph",
				courses_year: 2013
			},
			{
				courses_dept: "spph",
				courses_year: 2013
			},
			{
				courses_dept: "spph",
				courses_year: 2012
			},
			{
				courses_dept: "spph",
				courses_year: 2012
			},
			{
				courses_dept: "spph",
				courses_year: 2011
			},
			{
				courses_dept: "spph",
				courses_year: 2011
			},
			{
				courses_dept: "spph",
				courses_year: 2010
			},
			{
				courses_dept: "spph",
				courses_year: 2010
			},
			{
				courses_dept: "spph",
				courses_year: 2009
			},
			{
				courses_dept: "spph",
				courses_year: 2009
			},
			{
				courses_dept: "spph",
				courses_year: 1900
			},
			{
				courses_dept: "spph",
				courses_year: 1900
			},
			{
				courses_dept: "spph",
				courses_year: 1900
			},
			{
				courses_dept: "spph",
				courses_year: 1900
			},
			{
				courses_dept: "spph",
				courses_year: 1900
			},
			{
				courses_dept: "spph",
				courses_year: 1900
			},
			{
				courses_dept: "spph",
				courses_year: 1900
			},
			{
				courses_dept: "spph",
				courses_year: 1900
			},
			{
				courses_dept: "spph",
				courses_year: 1900
			},
			{
				courses_dept: "spph",
				courses_year: 1900
			},
			{
				courses_dept: "spph",
				courses_year: 1900
			},
			{
				courses_dept: "spph",
				courses_year: 1900
			},
			{
				courses_dept: "spph",
				courses_year: 1900
			},
			{
				courses_dept: "spph",
				courses_year: 1900
			},
			{
				courses_dept: "spph",
				courses_year: 1900
			},
			{
				courses_dept: "span",
				courses_year: 2008
			},
			{
				courses_dept: "span",
				courses_year: 1900
			},
			{
				courses_dept: "sowk",
				courses_year: 2015
			},
			{
				courses_dept: "sowk",
				courses_year: 2014
			},
			{
				courses_dept: "sowk",
				courses_year: 2014
			},
			{
				courses_dept: "sowk",
				courses_year: 2013
			},
			{
				courses_dept: "sowk",
				courses_year: 2012
			},
			{
				courses_dept: "sowk",
				courses_year: 2010
			},
			{
				courses_dept: "sowk",
				courses_year: 2010
			},
			{
				courses_dept: "sowk",
				courses_year: 2009
			},
			{
				courses_dept: "sowk",
				courses_year: 1900
			},
			{
				courses_dept: "sowk",
				courses_year: 1900
			},
			{
				courses_dept: "sowk",
				courses_year: 1900
			},
			{
				courses_dept: "rhsc",
				courses_year: 2009
			},
			{
				courses_dept: "rhsc",
				courses_year: 2008
			},
			{
				courses_dept: "psyc",
				courses_year: 2015
			},
			{
				courses_dept: "psyc",
				courses_year: 2015
			},
			{
				courses_dept: "psyc",
				courses_year: 2015
			},
			{
				courses_dept: "psyc",
				courses_year: 2014
			},
			{
				courses_dept: "psyc",
				courses_year: 2013
			},
			{
				courses_dept: "psyc",
				courses_year: 2012
			},
			{
				courses_dept: "psyc",
				courses_year: 2010
			},
			{
				courses_dept: "psyc",
				courses_year: 2008
			},
			{
				courses_dept: "psyc",
				courses_year: 2007
			},
			{
				courses_dept: "psyc",
				courses_year: 2007
			},
			{
				courses_dept: "psyc",
				courses_year: 1900
			},
			{
				courses_dept: "psyc",
				courses_year: 1900
			},
			{
				courses_dept: "psyc",
				courses_year: 1900
			},
			{
				courses_dept: "psyc",
				courses_year: 1900
			},
			{
				courses_dept: "psyc",
				courses_year: 1900
			},
			{
				courses_dept: "psyc",
				courses_year: 1900
			},
			{
				courses_dept: "psyc",
				courses_year: 1900
			},
			{
				courses_dept: "psyc",
				courses_year: 1900
			},
			{
				courses_dept: "psyc",
				courses_year: 1900
			},
			{
				courses_dept: "psyc",
				courses_year: 1900
			},
			{
				courses_dept: "plan",
				courses_year: 2011
			},
			{
				courses_dept: "plan",
				courses_year: 2010
			},
			{
				courses_dept: "plan",
				courses_year: 2010
			},
			{
				courses_dept: "plan",
				courses_year: 2008
			},
			{
				courses_dept: "plan",
				courses_year: 1900
			},
			{
				courses_dept: "plan",
				courses_year: 1900
			},
			{
				courses_dept: "plan",
				courses_year: 1900
			},
			{
				courses_dept: "plan",
				courses_year: 1900
			},
			{
				courses_dept: "phys",
				courses_year: 2015
			},
			{
				courses_dept: "phys",
				courses_year: 2015
			},
			{
				courses_dept: "phys",
				courses_year: 2010
			},
			{
				courses_dept: "phys",
				courses_year: 2010
			},
			{
				courses_dept: "phys",
				courses_year: 1900
			},
			{
				courses_dept: "phys",
				courses_year: 1900
			},
			{
				courses_dept: "phys",
				courses_year: 1900
			},
			{
				courses_dept: "phys",
				courses_year: 1900
			},
			{
				courses_dept: "phth",
				courses_year: 2014
			},
			{
				courses_dept: "phth",
				courses_year: 2013
			},
			{
				courses_dept: "phth",
				courses_year: 1900
			},
			{
				courses_dept: "phth",
				courses_year: 1900
			},
			{
				courses_dept: "phrm",
				courses_year: 2015
			},
			{
				courses_dept: "phrm",
				courses_year: 1900
			},
			{
				courses_dept: "phil",
				courses_year: 2010
			},
			{
				courses_dept: "phar",
				courses_year: 2014
			},
			{
				courses_dept: "phar",
				courses_year: 2014
			},
			{
				courses_dept: "phar",
				courses_year: 1900
			},
			{
				courses_dept: "pcth",
				courses_year: 1900
			},
			{
				courses_dept: "path",
				courses_year: 2008
			},
			{
				courses_dept: "onco",
				courses_year: 2013
			},
			{
				courses_dept: "onco",
				courses_year: 1900
			},
			{
				courses_dept: "obst",
				courses_year: 1900
			},
			{
				courses_dept: "nurs",
				courses_year: 2016
			},
			{
				courses_dept: "nurs",
				courses_year: 2016
			},
			{
				courses_dept: "nurs",
				courses_year: 2015
			},
			{
				courses_dept: "nurs",
				courses_year: 2015
			},
			{
				courses_dept: "nurs",
				courses_year: 2015
			},
			{
				courses_dept: "nurs",
				courses_year: 2015
			},
			{
				courses_dept: "nurs",
				courses_year: 2014
			},
			{
				courses_dept: "nurs",
				courses_year: 2014
			},
			{
				courses_dept: "nurs",
				courses_year: 2014
			},
			{
				courses_dept: "nurs",
				courses_year: 2013
			},
			{
				courses_dept: "nurs",
				courses_year: 2013
			},
			{
				courses_dept: "nurs",
				courses_year: 2013
			},
			{
				courses_dept: "nurs",
				courses_year: 2013
			},
			{
				courses_dept: "nurs",
				courses_year: 2013
			},
			{
				courses_dept: "nurs",
				courses_year: 2012
			},
			{
				courses_dept: "nurs",
				courses_year: 2011
			},
			{
				courses_dept: "nurs",
				courses_year: 2011
			},
			{
				courses_dept: "nurs",
				courses_year: 2011
			},
			{
				courses_dept: "nurs",
				courses_year: 2011
			},
			{
				courses_dept: "nurs",
				courses_year: 2010
			},
			{
				courses_dept: "nurs",
				courses_year: 2010
			},
			{
				courses_dept: "nurs",
				courses_year: 2010
			},
			{
				courses_dept: "nurs",
				courses_year: 2010
			},
			{
				courses_dept: "nurs",
				courses_year: 2010
			},
			{
				courses_dept: "nurs",
				courses_year: 2010
			},
			{
				courses_dept: "nurs",
				courses_year: 2007
			},
			{
				courses_dept: "nurs",
				courses_year: 2007
			},
			{
				courses_dept: "nurs",
				courses_year: 1900
			},
			{
				courses_dept: "nurs",
				courses_year: 1900
			},
			{
				courses_dept: "nurs",
				courses_year: 1900
			},
			{
				courses_dept: "nurs",
				courses_year: 1900
			},
			{
				courses_dept: "nurs",
				courses_year: 1900
			},
			{
				courses_dept: "nurs",
				courses_year: 1900
			},
			{
				courses_dept: "nurs",
				courses_year: 1900
			},
			{
				courses_dept: "nurs",
				courses_year: 1900
			},
			{
				courses_dept: "nurs",
				courses_year: 1900
			},
			{
				courses_dept: "nurs",
				courses_year: 1900
			},
			{
				courses_dept: "nurs",
				courses_year: 1900
			},
			{
				courses_dept: "nurs",
				courses_year: 1900
			},
			{
				courses_dept: "nurs",
				courses_year: 1900
			},
			{
				courses_dept: "nurs",
				courses_year: 1900
			},
			{
				courses_dept: "nurs",
				courses_year: 1900
			},
			{
				courses_dept: "nurs",
				courses_year: 1900
			},
			{
				courses_dept: "nurs",
				courses_year: 1900
			},
			{
				courses_dept: "nurs",
				courses_year: 1900
			},
			{
				courses_dept: "nurs",
				courses_year: 1900
			},
			{
				courses_dept: "nurs",
				courses_year: 1900
			},
			{
				courses_dept: "nurs",
				courses_year: 1900
			},
			{
				courses_dept: "nurs",
				courses_year: 1900
			},
			{
				courses_dept: "nurs",
				courses_year: 1900
			},
			{
				courses_dept: "nurs",
				courses_year: 1900
			},
			{
				courses_dept: "nurs",
				courses_year: 1900
			},
			{
				courses_dept: "nurs",
				courses_year: 1900
			},
			{
				courses_dept: "musc",
				courses_year: 2016
			},
			{
				courses_dept: "musc",
				courses_year: 2015
			},
			{
				courses_dept: "musc",
				courses_year: 2015
			},
			{
				courses_dept: "musc",
				courses_year: 2014
			},
			{
				courses_dept: "musc",
				courses_year: 2013
			},
			{
				courses_dept: "musc",
				courses_year: 2012
			},
			{
				courses_dept: "musc",
				courses_year: 2011
			},
			{
				courses_dept: "musc",
				courses_year: 2011
			},
			{
				courses_dept: "musc",
				courses_year: 2010
			},
			{
				courses_dept: "musc",
				courses_year: 2010
			},
			{
				courses_dept: "musc",
				courses_year: 2010
			},
			{
				courses_dept: "musc",
				courses_year: 2009
			},
			{
				courses_dept: "musc",
				courses_year: 2009
			},
			{
				courses_dept: "musc",
				courses_year: 1900
			},
			{
				courses_dept: "musc",
				courses_year: 1900
			},
			{
				courses_dept: "musc",
				courses_year: 1900
			},
			{
				courses_dept: "musc",
				courses_year: 1900
			},
			{
				courses_dept: "musc",
				courses_year: 1900
			},
			{
				courses_dept: "musc",
				courses_year: 1900
			},
			{
				courses_dept: "musc",
				courses_year: 1900
			},
			{
				courses_dept: "musc",
				courses_year: 1900
			},
			{
				courses_dept: "musc",
				courses_year: 1900
			},
			{
				courses_dept: "musc",
				courses_year: 1900
			},
			{
				courses_dept: "musc",
				courses_year: 1900
			},
			{
				courses_dept: "musc",
				courses_year: 1900
			},
			{
				courses_dept: "mtrl",
				courses_year: 2011
			},
			{
				courses_dept: "mtrl",
				courses_year: 2011
			},
			{
				courses_dept: "mtrl",
				courses_year: 2010
			},
			{
				courses_dept: "mtrl",
				courses_year: 1900
			},
			{
				courses_dept: "mtrl",
				courses_year: 1900
			},
			{
				courses_dept: "mine",
				courses_year: 2013
			},
			{
				courses_dept: "mine",
				courses_year: 2013
			},
			{
				courses_dept: "mine",
				courses_year: 2012
			},
			{
				courses_dept: "mine",
				courses_year: 2009
			},
			{
				courses_dept: "mine",
				courses_year: 1900
			},
			{
				courses_dept: "mine",
				courses_year: 1900
			},
			{
				courses_dept: "mine",
				courses_year: 1900
			},
			{
				courses_dept: "midw",
				courses_year: 2015
			},
			{
				courses_dept: "midw",
				courses_year: 2014
			},
			{
				courses_dept: "midw",
				courses_year: 2013
			},
			{
				courses_dept: "midw",
				courses_year: 2012
			},
			{
				courses_dept: "midw",
				courses_year: 2011
			},
			{
				courses_dept: "midw",
				courses_year: 1900
			},
			{
				courses_dept: "midw",
				courses_year: 1900
			},
			{
				courses_dept: "midw",
				courses_year: 1900
			},
			{
				courses_dept: "midw",
				courses_year: 1900
			},
			{
				courses_dept: "midw",
				courses_year: 1900
			},
			{
				courses_dept: "micb",
				courses_year: 2015
			},
			{
				courses_dept: "micb",
				courses_year: 2013
			},
			{
				courses_dept: "micb",
				courses_year: 2009
			},
			{
				courses_dept: "micb",
				courses_year: 1900
			},
			{
				courses_dept: "micb",
				courses_year: 1900
			},
			{
				courses_dept: "micb",
				courses_year: 1900
			},
			{
				courses_dept: "medi",
				courses_year: 2014
			},
			{
				courses_dept: "medi",
				courses_year: 2014
			},
			{
				courses_dept: "medi",
				courses_year: 2010
			},
			{
				courses_dept: "medi",
				courses_year: 1900
			},
			{
				courses_dept: "medi",
				courses_year: 1900
			},
			{
				courses_dept: "medg",
				courses_year: 2009
			},
			{
				courses_dept: "medg",
				courses_year: 2007
			},
			{
				courses_dept: "medg",
				courses_year: 1900
			},
			{
				courses_dept: "medg",
				courses_year: 1900
			},
			{
				courses_dept: "mech",
				courses_year: 2011
			},
			{
				courses_dept: "mech",
				courses_year: 1900
			},
			{
				courses_dept: "math",
				courses_year: 2016
			},
			{
				courses_dept: "math",
				courses_year: 2016
			},
			{
				courses_dept: "math",
				courses_year: 2015
			},
			{
				courses_dept: "math",
				courses_year: 2015
			},
			{
				courses_dept: "math",
				courses_year: 2015
			},
			{
				courses_dept: "math",
				courses_year: 2015
			},
			{
				courses_dept: "math",
				courses_year: 2015
			},
			{
				courses_dept: "math",
				courses_year: 2015
			},
			{
				courses_dept: "math",
				courses_year: 2013
			},
			{
				courses_dept: "math",
				courses_year: 2013
			},
			{
				courses_dept: "math",
				courses_year: 2012
			},
			{
				courses_dept: "math",
				courses_year: 2012
			},
			{
				courses_dept: "math",
				courses_year: 2011
			},
			{
				courses_dept: "math",
				courses_year: 2011
			},
			{
				courses_dept: "math",
				courses_year: 2010
			},
			{
				courses_dept: "math",
				courses_year: 2010
			},
			{
				courses_dept: "math",
				courses_year: 2010
			},
			{
				courses_dept: "math",
				courses_year: 2010
			},
			{
				courses_dept: "math",
				courses_year: 2009
			},
			{
				courses_dept: "math",
				courses_year: 2009
			},
			{
				courses_dept: "math",
				courses_year: 2009
			},
			{
				courses_dept: "math",
				courses_year: 2008
			},
			{
				courses_dept: "math",
				courses_year: 2007
			},
			{
				courses_dept: "math",
				courses_year: 2007
			},
			{
				courses_dept: "math",
				courses_year: 1900
			},
			{
				courses_dept: "math",
				courses_year: 1900
			},
			{
				courses_dept: "math",
				courses_year: 1900
			},
			{
				courses_dept: "math",
				courses_year: 1900
			},
			{
				courses_dept: "math",
				courses_year: 1900
			},
			{
				courses_dept: "math",
				courses_year: 1900
			},
			{
				courses_dept: "math",
				courses_year: 1900
			},
			{
				courses_dept: "math",
				courses_year: 1900
			},
			{
				courses_dept: "math",
				courses_year: 1900
			},
			{
				courses_dept: "math",
				courses_year: 1900
			},
			{
				courses_dept: "math",
				courses_year: 1900
			},
			{
				courses_dept: "math",
				courses_year: 1900
			},
			{
				courses_dept: "math",
				courses_year: 1900
			},
			{
				courses_dept: "math",
				courses_year: 1900
			},
			{
				courses_dept: "math",
				courses_year: 1900
			},
			{
				courses_dept: "math",
				courses_year: 1900
			},
			{
				courses_dept: "math",
				courses_year: 1900
			},
			{
				courses_dept: "math",
				courses_year: 1900
			},
			{
				courses_dept: "math",
				courses_year: 1900
			},
			{
				courses_dept: "math",
				courses_year: 1900
			},
			{
				courses_dept: "math",
				courses_year: 1900
			},
			{
				courses_dept: "math",
				courses_year: 1900
			},
			{
				courses_dept: "math",
				courses_year: 1900
			},
			{
				courses_dept: "math",
				courses_year: 1900
			},
			{
				courses_dept: "math",
				courses_year: 1900
			},
			{
				courses_dept: "math",
				courses_year: 1900
			},
			{
				courses_dept: "lled",
				courses_year: 2016
			},
			{
				courses_dept: "lled",
				courses_year: 1900
			},
			{
				courses_dept: "libr",
				courses_year: 2015
			},
			{
				courses_dept: "libr",
				courses_year: 1900
			},
			{
				courses_dept: "kin",
				courses_year: 2015
			},
			{
				courses_dept: "kin",
				courses_year: 2015
			},
			{
				courses_dept: "kin",
				courses_year: 2015
			},
			{
				courses_dept: "kin",
				courses_year: 2014
			},
			{
				courses_dept: "kin",
				courses_year: 2014
			},
			{
				courses_dept: "kin",
				courses_year: 2014
			},
			{
				courses_dept: "kin",
				courses_year: 2013
			},
			{
				courses_dept: "kin",
				courses_year: 2013
			},
			{
				courses_dept: "kin",
				courses_year: 2013
			},
			{
				courses_dept: "kin",
				courses_year: 2013
			},
			{
				courses_dept: "kin",
				courses_year: 2013
			},
			{
				courses_dept: "kin",
				courses_year: 2012
			},
			{
				courses_dept: "kin",
				courses_year: 2012
			},
			{
				courses_dept: "kin",
				courses_year: 2012
			},
			{
				courses_dept: "kin",
				courses_year: 1900
			},
			{
				courses_dept: "kin",
				courses_year: 1900
			},
			{
				courses_dept: "kin",
				courses_year: 1900
			},
			{
				courses_dept: "kin",
				courses_year: 1900
			},
			{
				courses_dept: "kin",
				courses_year: 1900
			},
			{
				courses_dept: "kin",
				courses_year: 1900
			},
			{
				courses_dept: "kin",
				courses_year: 1900
			},
			{
				courses_dept: "kin",
				courses_year: 1900
			},
			{
				courses_dept: "hinu",
				courses_year: 2007
			},
			{
				courses_dept: "hinu",
				courses_year: 1900
			},
			{
				courses_dept: "hgse",
				courses_year: 2016
			},
			{
				courses_dept: "hgse",
				courses_year: 2015
			},
			{
				courses_dept: "hgse",
				courses_year: 2014
			},
			{
				courses_dept: "hgse",
				courses_year: 2013
			},
			{
				courses_dept: "hgse",
				courses_year: 2013
			},
			{
				courses_dept: "hgse",
				courses_year: 1900
			},
			{
				courses_dept: "hgse",
				courses_year: 1900
			},
			{
				courses_dept: "hgse",
				courses_year: 1900
			},
			{
				courses_dept: "hgse",
				courses_year: 1900
			},
			{
				courses_dept: "hgse",
				courses_year: 1900
			},
			{
				courses_dept: "gpp",
				courses_year: 2015
			},
			{
				courses_dept: "gpp",
				courses_year: 1900
			},
			{
				courses_dept: "frst",
				courses_year: 2015
			},
			{
				courses_dept: "frst",
				courses_year: 2014
			},
			{
				courses_dept: "frst",
				courses_year: 1900
			},
			{
				courses_dept: "fnh",
				courses_year: 2015
			},
			{
				courses_dept: "fish",
				courses_year: 2009
			},
			{
				courses_dept: "fish",
				courses_year: 1900
			},
			{
				courses_dept: "fipr",
				courses_year: 2015
			},
			{
				courses_dept: "fipr",
				courses_year: 1900
			},
			{
				courses_dept: "etec",
				courses_year: 2016
			},
			{
				courses_dept: "etec",
				courses_year: 2015
			},
			{
				courses_dept: "etec",
				courses_year: 2015
			},
			{
				courses_dept: "etec",
				courses_year: 2015
			},
			{
				courses_dept: "etec",
				courses_year: 2015
			},
			{
				courses_dept: "etec",
				courses_year: 2014
			},
			{
				courses_dept: "etec",
				courses_year: 2014
			},
			{
				courses_dept: "etec",
				courses_year: 2014
			},
			{
				courses_dept: "etec",
				courses_year: 2014
			},
			{
				courses_dept: "etec",
				courses_year: 2013
			},
			{
				courses_dept: "etec",
				courses_year: 2013
			},
			{
				courses_dept: "etec",
				courses_year: 2013
			},
			{
				courses_dept: "etec",
				courses_year: 2013
			},
			{
				courses_dept: "etec",
				courses_year: 2013
			},
			{
				courses_dept: "etec",
				courses_year: 2012
			},
			{
				courses_dept: "etec",
				courses_year: 2012
			},
			{
				courses_dept: "etec",
				courses_year: 2012
			},
			{
				courses_dept: "etec",
				courses_year: 2012
			},
			{
				courses_dept: "etec",
				courses_year: 2011
			},
			{
				courses_dept: "etec",
				courses_year: 2011
			},
			{
				courses_dept: "etec",
				courses_year: 2011
			},
			{
				courses_dept: "etec",
				courses_year: 2011
			},
			{
				courses_dept: "etec",
				courses_year: 2010
			},
			{
				courses_dept: "etec",
				courses_year: 2008
			},
			{
				courses_dept: "etec",
				courses_year: 1900
			},
			{
				courses_dept: "etec",
				courses_year: 1900
			},
			{
				courses_dept: "etec",
				courses_year: 1900
			},
			{
				courses_dept: "etec",
				courses_year: 1900
			},
			{
				courses_dept: "etec",
				courses_year: 1900
			},
			{
				courses_dept: "etec",
				courses_year: 1900
			},
			{
				courses_dept: "etec",
				courses_year: 1900
			},
			{
				courses_dept: "etec",
				courses_year: 1900
			},
			{
				courses_dept: "etec",
				courses_year: 1900
			},
			{
				courses_dept: "etec",
				courses_year: 1900
			},
			{
				courses_dept: "etec",
				courses_year: 1900
			},
			{
				courses_dept: "etec",
				courses_year: 1900
			},
			{
				courses_dept: "etec",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 2016
			},
			{
				courses_dept: "epse",
				courses_year: 2016
			},
			{
				courses_dept: "epse",
				courses_year: 2016
			},
			{
				courses_dept: "epse",
				courses_year: 2016
			},
			{
				courses_dept: "epse",
				courses_year: 2015
			},
			{
				courses_dept: "epse",
				courses_year: 2015
			},
			{
				courses_dept: "epse",
				courses_year: 2015
			},
			{
				courses_dept: "epse",
				courses_year: 2015
			},
			{
				courses_dept: "epse",
				courses_year: 2015
			},
			{
				courses_dept: "epse",
				courses_year: 2015
			},
			{
				courses_dept: "epse",
				courses_year: 2015
			},
			{
				courses_dept: "epse",
				courses_year: 2015
			},
			{
				courses_dept: "epse",
				courses_year: 2015
			},
			{
				courses_dept: "epse",
				courses_year: 2015
			},
			{
				courses_dept: "epse",
				courses_year: 2015
			},
			{
				courses_dept: "epse",
				courses_year: 2015
			},
			{
				courses_dept: "epse",
				courses_year: 2015
			},
			{
				courses_dept: "epse",
				courses_year: 2015
			},
			{
				courses_dept: "epse",
				courses_year: 2015
			},
			{
				courses_dept: "epse",
				courses_year: 2015
			},
			{
				courses_dept: "epse",
				courses_year: 2015
			},
			{
				courses_dept: "epse",
				courses_year: 2015
			},
			{
				courses_dept: "epse",
				courses_year: 2014
			},
			{
				courses_dept: "epse",
				courses_year: 2014
			},
			{
				courses_dept: "epse",
				courses_year: 2014
			},
			{
				courses_dept: "epse",
				courses_year: 2014
			},
			{
				courses_dept: "epse",
				courses_year: 2014
			},
			{
				courses_dept: "epse",
				courses_year: 2014
			},
			{
				courses_dept: "epse",
				courses_year: 2014
			},
			{
				courses_dept: "epse",
				courses_year: 2014
			},
			{
				courses_dept: "epse",
				courses_year: 2014
			},
			{
				courses_dept: "epse",
				courses_year: 2014
			},
			{
				courses_dept: "epse",
				courses_year: 2014
			},
			{
				courses_dept: "epse",
				courses_year: 2014
			},
			{
				courses_dept: "epse",
				courses_year: 2014
			},
			{
				courses_dept: "epse",
				courses_year: 2014
			},
			{
				courses_dept: "epse",
				courses_year: 2014
			},
			{
				courses_dept: "epse",
				courses_year: 2014
			},
			{
				courses_dept: "epse",
				courses_year: 2014
			},
			{
				courses_dept: "epse",
				courses_year: 2014
			},
			{
				courses_dept: "epse",
				courses_year: 2014
			},
			{
				courses_dept: "epse",
				courses_year: 2014
			},
			{
				courses_dept: "epse",
				courses_year: 2014
			},
			{
				courses_dept: "epse",
				courses_year: 2013
			},
			{
				courses_dept: "epse",
				courses_year: 2013
			},
			{
				courses_dept: "epse",
				courses_year: 2013
			},
			{
				courses_dept: "epse",
				courses_year: 2013
			},
			{
				courses_dept: "epse",
				courses_year: 2013
			},
			{
				courses_dept: "epse",
				courses_year: 2013
			},
			{
				courses_dept: "epse",
				courses_year: 2013
			},
			{
				courses_dept: "epse",
				courses_year: 2013
			},
			{
				courses_dept: "epse",
				courses_year: 2013
			},
			{
				courses_dept: "epse",
				courses_year: 2013
			},
			{
				courses_dept: "epse",
				courses_year: 2013
			},
			{
				courses_dept: "epse",
				courses_year: 2013
			},
			{
				courses_dept: "epse",
				courses_year: 2013
			},
			{
				courses_dept: "epse",
				courses_year: 2013
			},
			{
				courses_dept: "epse",
				courses_year: 2013
			},
			{
				courses_dept: "epse",
				courses_year: 2013
			},
			{
				courses_dept: "epse",
				courses_year: 2013
			},
			{
				courses_dept: "epse",
				courses_year: 2012
			},
			{
				courses_dept: "epse",
				courses_year: 2012
			},
			{
				courses_dept: "epse",
				courses_year: 2012
			},
			{
				courses_dept: "epse",
				courses_year: 2012
			},
			{
				courses_dept: "epse",
				courses_year: 2012
			},
			{
				courses_dept: "epse",
				courses_year: 2012
			},
			{
				courses_dept: "epse",
				courses_year: 2012
			},
			{
				courses_dept: "epse",
				courses_year: 2012
			},
			{
				courses_dept: "epse",
				courses_year: 2012
			},
			{
				courses_dept: "epse",
				courses_year: 2012
			},
			{
				courses_dept: "epse",
				courses_year: 2012
			},
			{
				courses_dept: "epse",
				courses_year: 2012
			},
			{
				courses_dept: "epse",
				courses_year: 2012
			},
			{
				courses_dept: "epse",
				courses_year: 2012
			},
			{
				courses_dept: "epse",
				courses_year: 2012
			},
			{
				courses_dept: "epse",
				courses_year: 2012
			},
			{
				courses_dept: "epse",
				courses_year: 2012
			},
			{
				courses_dept: "epse",
				courses_year: 2012
			},
			{
				courses_dept: "epse",
				courses_year: 2012
			},
			{
				courses_dept: "epse",
				courses_year: 2012
			},
			{
				courses_dept: "epse",
				courses_year: 2012
			},
			{
				courses_dept: "epse",
				courses_year: 2012
			},
			{
				courses_dept: "epse",
				courses_year: 2012
			},
			{
				courses_dept: "epse",
				courses_year: 2011
			},
			{
				courses_dept: "epse",
				courses_year: 2011
			},
			{
				courses_dept: "epse",
				courses_year: 2011
			},
			{
				courses_dept: "epse",
				courses_year: 2011
			},
			{
				courses_dept: "epse",
				courses_year: 2011
			},
			{
				courses_dept: "epse",
				courses_year: 2011
			},
			{
				courses_dept: "epse",
				courses_year: 2011
			},
			{
				courses_dept: "epse",
				courses_year: 2011
			},
			{
				courses_dept: "epse",
				courses_year: 2011
			},
			{
				courses_dept: "epse",
				courses_year: 2011
			},
			{
				courses_dept: "epse",
				courses_year: 2011
			},
			{
				courses_dept: "epse",
				courses_year: 2011
			},
			{
				courses_dept: "epse",
				courses_year: 2011
			},
			{
				courses_dept: "epse",
				courses_year: 2011
			},
			{
				courses_dept: "epse",
				courses_year: 2011
			},
			{
				courses_dept: "epse",
				courses_year: 2011
			},
			{
				courses_dept: "epse",
				courses_year: 2010
			},
			{
				courses_dept: "epse",
				courses_year: 2010
			},
			{
				courses_dept: "epse",
				courses_year: 2010
			},
			{
				courses_dept: "epse",
				courses_year: 2010
			},
			{
				courses_dept: "epse",
				courses_year: 2010
			},
			{
				courses_dept: "epse",
				courses_year: 2010
			},
			{
				courses_dept: "epse",
				courses_year: 2010
			},
			{
				courses_dept: "epse",
				courses_year: 2010
			},
			{
				courses_dept: "epse",
				courses_year: 2010
			},
			{
				courses_dept: "epse",
				courses_year: 2010
			},
			{
				courses_dept: "epse",
				courses_year: 2010
			},
			{
				courses_dept: "epse",
				courses_year: 2010
			},
			{
				courses_dept: "epse",
				courses_year: 2010
			},
			{
				courses_dept: "epse",
				courses_year: 2010
			},
			{
				courses_dept: "epse",
				courses_year: 2009
			},
			{
				courses_dept: "epse",
				courses_year: 2009
			},
			{
				courses_dept: "epse",
				courses_year: 2009
			},
			{
				courses_dept: "epse",
				courses_year: 2009
			},
			{
				courses_dept: "epse",
				courses_year: 2009
			},
			{
				courses_dept: "epse",
				courses_year: 2009
			},
			{
				courses_dept: "epse",
				courses_year: 2009
			},
			{
				courses_dept: "epse",
				courses_year: 2009
			},
			{
				courses_dept: "epse",
				courses_year: 2009
			},
			{
				courses_dept: "epse",
				courses_year: 2009
			},
			{
				courses_dept: "epse",
				courses_year: 2009
			},
			{
				courses_dept: "epse",
				courses_year: 2009
			},
			{
				courses_dept: "epse",
				courses_year: 2009
			},
			{
				courses_dept: "epse",
				courses_year: 2009
			},
			{
				courses_dept: "epse",
				courses_year: 2009
			},
			{
				courses_dept: "epse",
				courses_year: 2008
			},
			{
				courses_dept: "epse",
				courses_year: 2008
			},
			{
				courses_dept: "epse",
				courses_year: 2008
			},
			{
				courses_dept: "epse",
				courses_year: 2007
			},
			{
				courses_dept: "epse",
				courses_year: 2007
			},
			{
				courses_dept: "epse",
				courses_year: 2007
			},
			{
				courses_dept: "epse",
				courses_year: 2007
			},
			{
				courses_dept: "epse",
				courses_year: 2007
			},
			{
				courses_dept: "epse",
				courses_year: 2007
			},
			{
				courses_dept: "epse",
				courses_year: 2007
			},
			{
				courses_dept: "epse",
				courses_year: 2007
			},
			{
				courses_dept: "epse",
				courses_year: 2007
			},
			{
				courses_dept: "epse",
				courses_year: 2007
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "epse",
				courses_year: 1900
			},
			{
				courses_dept: "eosc",
				courses_year: 2014
			},
			{
				courses_dept: "eosc",
				courses_year: 1900
			},
			{
				courses_dept: "elec",
				courses_year: 2015
			},
			{
				courses_dept: "elec",
				courses_year: 2015
			},
			{
				courses_dept: "elec",
				courses_year: 1900
			},
			{
				courses_dept: "eece",
				courses_year: 2015
			},
			{
				courses_dept: "eece",
				courses_year: 2013
			},
			{
				courses_dept: "eece",
				courses_year: 2009
			},
			{
				courses_dept: "eece",
				courses_year: 2008
			},
			{
				courses_dept: "eece",
				courses_year: 2007
			},
			{
				courses_dept: "eece",
				courses_year: 1900
			},
			{
				courses_dept: "eece",
				courses_year: 1900
			},
			{
				courses_dept: "eece",
				courses_year: 1900
			},
			{
				courses_dept: "eece",
				courses_year: 1900
			},
			{
				courses_dept: "eece",
				courses_year: 1900
			},
			{
				courses_dept: "educ",
				courses_year: 2016
			},
			{
				courses_dept: "educ",
				courses_year: 2015
			},
			{
				courses_dept: "educ",
				courses_year: 2015
			},
			{
				courses_dept: "educ",
				courses_year: 2014
			},
			{
				courses_dept: "educ",
				courses_year: 2014
			},
			{
				courses_dept: "educ",
				courses_year: 2013
			},
			{
				courses_dept: "educ",
				courses_year: 2013
			},
			{
				courses_dept: "educ",
				courses_year: 2012
			},
			{
				courses_dept: "educ",
				courses_year: 2011
			},
			{
				courses_dept: "educ",
				courses_year: 2011
			},
			{
				courses_dept: "educ",
				courses_year: 2011
			},
			{
				courses_dept: "educ",
				courses_year: 2008
			},
			{
				courses_dept: "educ",
				courses_year: 1900
			},
			{
				courses_dept: "edst",
				courses_year: 2015
			},
			{
				courses_dept: "edst",
				courses_year: 2015
			},
			{
				courses_dept: "edst",
				courses_year: 2014
			},
			{
				courses_dept: "edst",
				courses_year: 2014
			},
			{
				courses_dept: "edst",
				courses_year: 2014
			},
			{
				courses_dept: "edst",
				courses_year: 2014
			},
			{
				courses_dept: "edst",
				courses_year: 2013
			},
			{
				courses_dept: "edst",
				courses_year: 2011
			},
			{
				courses_dept: "edst",
				courses_year: 2010
			},
			{
				courses_dept: "edst",
				courses_year: 2007
			},
			{
				courses_dept: "edst",
				courses_year: 1900
			},
			{
				courses_dept: "edst",
				courses_year: 1900
			},
			{
				courses_dept: "edst",
				courses_year: 1900
			},
			{
				courses_dept: "edst",
				courses_year: 1900
			},
			{
				courses_dept: "edst",
				courses_year: 1900
			},
			{
				courses_dept: "edst",
				courses_year: 1900
			},
			{
				courses_dept: "edst",
				courses_year: 1900
			},
			{
				courses_dept: "edst",
				courses_year: 1900
			},
			{
				courses_dept: "edst",
				courses_year: 1900
			},
			{
				courses_dept: "edcp",
				courses_year: 2015
			},
			{
				courses_dept: "edcp",
				courses_year: 2015
			},
			{
				courses_dept: "edcp",
				courses_year: 2013
			},
			{
				courses_dept: "edcp",
				courses_year: 2013
			},
			{
				courses_dept: "edcp",
				courses_year: 2013
			},
			{
				courses_dept: "edcp",
				courses_year: 2012
			},
			{
				courses_dept: "edcp",
				courses_year: 2011
			},
			{
				courses_dept: "edcp",
				courses_year: 2011
			},
			{
				courses_dept: "edcp",
				courses_year: 2010
			},
			{
				courses_dept: "edcp",
				courses_year: 1900
			},
			{
				courses_dept: "edcp",
				courses_year: 1900
			},
			{
				courses_dept: "edcp",
				courses_year: 1900
			},
			{
				courses_dept: "edcp",
				courses_year: 1900
			},
			{
				courses_dept: "edcp",
				courses_year: 1900
			},
			{
				courses_dept: "edcp",
				courses_year: 1900
			},
			{
				courses_dept: "econ",
				courses_year: 2016
			},
			{
				courses_dept: "econ",
				courses_year: 2014
			},
			{
				courses_dept: "econ",
				courses_year: 2010
			},
			{
				courses_dept: "econ",
				courses_year: 2007
			},
			{
				courses_dept: "econ",
				courses_year: 1900
			},
			{
				courses_dept: "econ",
				courses_year: 1900
			},
			{
				courses_dept: "econ",
				courses_year: 1900
			},
			{
				courses_dept: "econ",
				courses_year: 1900
			},
			{
				courses_dept: "eced",
				courses_year: 2014
			},
			{
				courses_dept: "eced",
				courses_year: 2012
			},
			{
				courses_dept: "eced",
				courses_year: 1900
			},
			{
				courses_dept: "dhyg",
				courses_year: 2013
			},
			{
				courses_dept: "dhyg",
				courses_year: 2012
			},
			{
				courses_dept: "dent",
				courses_year: 2012
			},
			{
				courses_dept: "dent",
				courses_year: 1900
			},
			{
				courses_dept: "crwr",
				courses_year: 2015
			},
			{
				courses_dept: "crwr",
				courses_year: 2015
			},
			{
				courses_dept: "crwr",
				courses_year: 2015
			},
			{
				courses_dept: "crwr",
				courses_year: 2014
			},
			{
				courses_dept: "crwr",
				courses_year: 2014
			},
			{
				courses_dept: "crwr",
				courses_year: 2014
			},
			{
				courses_dept: "crwr",
				courses_year: 2014
			},
			{
				courses_dept: "crwr",
				courses_year: 2014
			},
			{
				courses_dept: "crwr",
				courses_year: 2014
			},
			{
				courses_dept: "crwr",
				courses_year: 2014
			},
			{
				courses_dept: "crwr",
				courses_year: 2014
			},
			{
				courses_dept: "crwr",
				courses_year: 2014
			},
			{
				courses_dept: "crwr",
				courses_year: 2014
			},
			{
				courses_dept: "crwr",
				courses_year: 2013
			},
			{
				courses_dept: "crwr",
				courses_year: 2013
			},
			{
				courses_dept: "crwr",
				courses_year: 2013
			},
			{
				courses_dept: "crwr",
				courses_year: 2013
			},
			{
				courses_dept: "crwr",
				courses_year: 2013
			},
			{
				courses_dept: "crwr",
				courses_year: 2013
			},
			{
				courses_dept: "crwr",
				courses_year: 2013
			},
			{
				courses_dept: "crwr",
				courses_year: 2013
			},
			{
				courses_dept: "crwr",
				courses_year: 2013
			},
			{
				courses_dept: "crwr",
				courses_year: 2013
			},
			{
				courses_dept: "crwr",
				courses_year: 2013
			},
			{
				courses_dept: "crwr",
				courses_year: 2012
			},
			{
				courses_dept: "crwr",
				courses_year: 2012
			},
			{
				courses_dept: "crwr",
				courses_year: 2012
			},
			{
				courses_dept: "crwr",
				courses_year: 2012
			},
			{
				courses_dept: "crwr",
				courses_year: 2012
			},
			{
				courses_dept: "crwr",
				courses_year: 1900
			},
			{
				courses_dept: "crwr",
				courses_year: 1900
			},
			{
				courses_dept: "crwr",
				courses_year: 1900
			},
			{
				courses_dept: "crwr",
				courses_year: 1900
			},
			{
				courses_dept: "crwr",
				courses_year: 1900
			},
			{
				courses_dept: "crwr",
				courses_year: 1900
			},
			{
				courses_dept: "crwr",
				courses_year: 1900
			},
			{
				courses_dept: "crwr",
				courses_year: 1900
			},
			{
				courses_dept: "crwr",
				courses_year: 1900
			},
			{
				courses_dept: "cpsc",
				courses_year: 2014
			},
			{
				courses_dept: "cpsc",
				courses_year: 2013
			},
			{
				courses_dept: "cpsc",
				courses_year: 2011
			},
			{
				courses_dept: "cpsc",
				courses_year: 2007
			},
			{
				courses_dept: "cpsc",
				courses_year: 2007
			},
			{
				courses_dept: "cpsc",
				courses_year: 1900
			},
			{
				courses_dept: "cpsc",
				courses_year: 1900
			},
			{
				courses_dept: "cpsc",
				courses_year: 1900
			},
			{
				courses_dept: "cpsc",
				courses_year: 1900
			},
			{
				courses_dept: "cpsc",
				courses_year: 1900
			},
			{
				courses_dept: "comm",
				courses_year: 2012
			},
			{
				courses_dept: "comm",
				courses_year: 2010
			},
			{
				courses_dept: "comm",
				courses_year: 2007
			},
			{
				courses_dept: "comm",
				courses_year: 1900
			},
			{
				courses_dept: "comm",
				courses_year: 1900
			},
			{
				courses_dept: "comm",
				courses_year: 1900
			},
			{
				courses_dept: "cnps",
				courses_year: 2016
			},
			{
				courses_dept: "cnps",
				courses_year: 2015
			},
			{
				courses_dept: "cnps",
				courses_year: 2015
			},
			{
				courses_dept: "cnps",
				courses_year: 2014
			},
			{
				courses_dept: "cnps",
				courses_year: 2014
			},
			{
				courses_dept: "cnps",
				courses_year: 2014
			},
			{
				courses_dept: "cnps",
				courses_year: 2013
			},
			{
				courses_dept: "cnps",
				courses_year: 2013
			},
			{
				courses_dept: "cnps",
				courses_year: 2013
			},
			{
				courses_dept: "cnps",
				courses_year: 2013
			},
			{
				courses_dept: "cnps",
				courses_year: 2012
			},
			{
				courses_dept: "cnps",
				courses_year: 2012
			},
			{
				courses_dept: "cnps",
				courses_year: 2012
			},
			{
				courses_dept: "cnps",
				courses_year: 2012
			},
			{
				courses_dept: "cnps",
				courses_year: 2012
			},
			{
				courses_dept: "cnps",
				courses_year: 2011
			},
			{
				courses_dept: "cnps",
				courses_year: 2011
			},
			{
				courses_dept: "cnps",
				courses_year: 2011
			},
			{
				courses_dept: "cnps",
				courses_year: 2011
			},
			{
				courses_dept: "cnps",
				courses_year: 2009
			},
			{
				courses_dept: "cnps",
				courses_year: 2008
			},
			{
				courses_dept: "cnps",
				courses_year: 2008
			},
			{
				courses_dept: "cnps",
				courses_year: 1900
			},
			{
				courses_dept: "cnps",
				courses_year: 1900
			},
			{
				courses_dept: "cnps",
				courses_year: 1900
			},
			{
				courses_dept: "cnps",
				courses_year: 1900
			},
			{
				courses_dept: "cnps",
				courses_year: 1900
			},
			{
				courses_dept: "cnps",
				courses_year: 1900
			},
			{
				courses_dept: "cnps",
				courses_year: 1900
			},
			{
				courses_dept: "cnps",
				courses_year: 1900
			},
			{
				courses_dept: "cnps",
				courses_year: 1900
			},
			{
				courses_dept: "cnps",
				courses_year: 1900
			},
			{
				courses_dept: "cnps",
				courses_year: 1900
			},
			{
				courses_dept: "cnps",
				courses_year: 1900
			},
			{
				courses_dept: "cnps",
				courses_year: 1900
			},
			{
				courses_dept: "cnps",
				courses_year: 1900
			},
			{
				courses_dept: "cnps",
				courses_year: 1900
			},
			{
				courses_dept: "cnps",
				courses_year: 1900
			},
			{
				courses_dept: "cnps",
				courses_year: 1900
			},
			{
				courses_dept: "cnps",
				courses_year: 1900
			},
			{
				courses_dept: "civl",
				courses_year: 2012
			},
			{
				courses_dept: "civl",
				courses_year: 1900
			},
			{
				courses_dept: "chbe",
				courses_year: 2015
			},
			{
				courses_dept: "chbe",
				courses_year: 2015
			},
			{
				courses_dept: "chbe",
				courses_year: 2013
			},
			{
				courses_dept: "chbe",
				courses_year: 1900
			},
			{
				courses_dept: "chbe",
				courses_year: 1900
			},
			{
				courses_dept: "chbe",
				courses_year: 1900
			},
			{
				courses_dept: "cell",
				courses_year: 2011
			},
			{
				courses_dept: "cell",
				courses_year: 2010
			},
			{
				courses_dept: "cell",
				courses_year: 1900
			},
			{
				courses_dept: "cell",
				courses_year: 1900
			},
			{
				courses_dept: "ceen",
				courses_year: 2013
			},
			{
				courses_dept: "ccst",
				courses_year: 2010
			},
			{
				courses_dept: "ccst",
				courses_year: 1900
			},
			{
				courses_dept: "bmeg",
				courses_year: 2014
			},
			{
				courses_dept: "bmeg",
				courses_year: 2012
			},
			{
				courses_dept: "bmeg",
				courses_year: 1900
			},
			{
				courses_dept: "bmeg",
				courses_year: 1900
			},
			{
				courses_dept: "biol",
				courses_year: 2015
			},
			{
				courses_dept: "biol",
				courses_year: 1900
			},
			{
				courses_dept: "biof",
				courses_year: 2013
			},
			{
				courses_dept: "biof",
				courses_year: 1900
			},
			{
				courses_dept: "audi",
				courses_year: 2016
			},
			{
				courses_dept: "audi",
				courses_year: 2014
			},
			{
				courses_dept: "audi",
				courses_year: 2014
			},
			{
				courses_dept: "audi",
				courses_year: 2014
			},
			{
				courses_dept: "audi",
				courses_year: 2013
			},
			{
				courses_dept: "audi",
				courses_year: 2013
			},
			{
				courses_dept: "audi",
				courses_year: 2012
			},
			{
				courses_dept: "audi",
				courses_year: 2010
			},
			{
				courses_dept: "audi",
				courses_year: 2010
			},
			{
				courses_dept: "audi",
				courses_year: 2009
			},
			{
				courses_dept: "audi",
				courses_year: 2009
			},
			{
				courses_dept: "audi",
				courses_year: 2008
			},
			{
				courses_dept: "audi",
				courses_year: 2007
			},
			{
				courses_dept: "audi",
				courses_year: 1900
			},
			{
				courses_dept: "audi",
				courses_year: 1900
			},
			{
				courses_dept: "audi",
				courses_year: 1900
			},
			{
				courses_dept: "audi",
				courses_year: 1900
			},
			{
				courses_dept: "audi",
				courses_year: 1900
			},
			{
				courses_dept: "audi",
				courses_year: 1900
			},
			{
				courses_dept: "audi",
				courses_year: 1900
			},
			{
				courses_dept: "audi",
				courses_year: 1900
			},
			{
				courses_dept: "audi",
				courses_year: 1900
			},
			{
				courses_dept: "audi",
				courses_year: 1900
			},
			{
				courses_dept: "audi",
				courses_year: 1900
			},
			{
				courses_dept: "audi",
				courses_year: 1900
			},
			{
				courses_dept: "audi",
				courses_year: 1900
			},
			{
				courses_dept: "arst",
				courses_year: 2012
			},
			{
				courses_dept: "arst",
				courses_year: 2008
			},
			{
				courses_dept: "arst",
				courses_year: 1900
			},
			{
				courses_dept: "arst",
				courses_year: 1900
			},
			{
				courses_dept: "apsc",
				courses_year: 2010
			},
			{
				courses_dept: "apsc",
				courses_year: 2010
			},
			{
				courses_dept: "apsc",
				courses_year: 2009
			},
			{
				courses_dept: "apsc",
				courses_year: 2009
			},
			{
				courses_dept: "apsc",
				courses_year: 2007
			},
			{
				courses_dept: "apsc",
				courses_year: 2007
			},
			{
				courses_dept: "apsc",
				courses_year: 2007
			},
			{
				courses_dept: "adhe",
				courses_year: 2016
			},
			{
				courses_dept: "adhe",
				courses_year: 2015
			},
			{
				courses_dept: "aanb",
				courses_year: 2015
			},
			{
				courses_dept: "aanb",
				courses_year: 1900
			}
		];
		let keys = ["courses_dept",	"courses_year"];
		beforeEach(function () {
			fs.removeSync("data");
			facade = new InsightFacade();
		});
		it("should RDS pass add then remove", async function () {
			this.timeout(10000);
			// await facade.addDataset("courses", courses, InsightDatasetKind.Courses);
			// let f = facade as InsightFacade;
			let sortedQ = sortByKeys(q, keys);
			let groups = group(keys, sortedQ);
			console.log(groups.length);

			// let a = getArrayKeys(q["OPTIONS"]["COLUMNS"]);
			// // let b = f.executeFilter(q3, a);
			// console.log(a.length);
			// // console.log(b.length);
			// for (let x of a) {
			// 	console.log(x);
			// }
			// console.log(isValidQuery(q));
			// console.log(isValidQuery(q2));
		});
		// it("should list one datasets", function () {
		// 	return facade.addDataset("courses", courses8, InsightDatasetKind.Courses)
		// 		.then(() => {
		// 			return facade.listDatasets();
		// 		})
		// 		.then((insightDatasets) => {
		// 			expect(insightDatasets).to.deep.equal([{
		// 				id: "courses",
		// 				kind: InsightDatasetKind.Courses,
		// 				numRows: 64612,
		// 			}]);
		// 		});
		// });
		// it("should list one datasets", function () {
		// 	fs.removeSync("data");
		// });
		// after(function () {
		// 	fs.removeSync("data");
		// });
	});
	// after(function () {
	// 	fs.removeSync("data");
	// });
});

