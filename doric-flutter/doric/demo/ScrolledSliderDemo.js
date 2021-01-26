'use strict';

var doric = require('doric');

const colors = [
    "#70a1ff",
    "#7bed9f",
    "#ff6b81",
    "#a4b0be",
    "#f0932b",
    "#eb4d4b",
    "#6ab04c",
    "#e056fd",
    "#686de0",
    "#30336b",
].map(e => doric.Color.parse(e));

var count = 20;
var start = 0;
var total = 250;
var subjects = [
	{
		rating: {
			max: 10,
			average: 9.7,
			details: {
				"1": 1485,
				"2": 1227,
				"3": 20003,
				"4": 200994,
				"5": 1271520
			},
			stars: "50",
			min: 0
		},
		genres: [
			"犯罪",
			"剧情"
		],
		title: "肖申克的救赎",
		casts: [
			{
				avatars: {
					small: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p17525.webp",
					large: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p17525.webp",
					medium: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p17525.webp"
				},
				name_en: "Tim Robbins",
				name: "蒂姆·罗宾斯",
				alt: "https://movie.douban.com/celebrity/1054521/",
				id: "1054521"
			},
			{
				avatars: {
					small: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p34642.webp",
					large: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p34642.webp",
					medium: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p34642.webp"
				},
				name_en: "Morgan Freeman",
				name: "摩根·弗里曼",
				alt: "https://movie.douban.com/celebrity/1054534/",
				id: "1054534"
			},
			{
				avatars: {
					small: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p5837.webp",
					large: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p5837.webp",
					medium: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p5837.webp"
				},
				name_en: "Bob Gunton",
				name: "鲍勃·冈顿",
				alt: "https://movie.douban.com/celebrity/1041179/",
				id: "1041179"
			}
		],
		durations: [
			"142分钟"
		],
		collect_count: 2688754,
		mainland_pubdate: "",
		has_video: true,
		original_title: "The Shawshank Redemption",
		subtype: "movie",
		directors: [
			{
				avatars: {
					small: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p230.webp",
					large: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p230.webp",
					medium: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p230.webp"
				},
				name_en: "Frank Darabont",
				name: "弗兰克·德拉邦特",
				alt: "https://movie.douban.com/celebrity/1047973/",
				id: "1047973"
			}
		],
		pubdates: [
			"1994-09-10(多伦多电影节)",
			"1994-10-14(美国)"
		],
		year: "1994",
		images: {
			small: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p480747492.webp",
			large: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p480747492.webp",
			medium: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p480747492.webp"
		},
		alt: "https://movie.douban.com/subject/1292052/",
		id: "1292052"
	},
	{
		rating: {
			max: 10,
			average: 9.6,
			details: {
				"1": 1519,
				"2": 1673,
				"3": 23449,
				"4": 182395,
				"5": 928919
			},
			stars: "50",
			min: 0
		},
		genres: [
			"剧情",
			"爱情",
			"同性"
		],
		title: "霸王别姬",
		casts: [
			{
				avatars: {
					small: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p67.webp",
					large: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p67.webp",
					medium: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p67.webp"
				},
				name_en: "Leslie Cheung",
				name: "张国荣",
				alt: "https://movie.douban.com/celebrity/1003494/",
				id: "1003494"
			},
			{
				avatars: {
					small: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p46345.webp",
					large: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p46345.webp",
					medium: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p46345.webp"
				},
				name_en: "Fengyi Zhang",
				name: "张丰毅",
				alt: "https://movie.douban.com/celebrity/1050265/",
				id: "1050265"
			},
			{
				avatars: {
					small: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1399268395.47.webp",
					large: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1399268395.47.webp",
					medium: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1399268395.47.webp"
				},
				name_en: "Li Gong",
				name: "巩俐",
				alt: "https://movie.douban.com/celebrity/1035641/",
				id: "1035641"
			}
		],
		durations: [
			"171 分钟"
		],
		collect_count: 2105626,
		mainland_pubdate: "1993-07-26",
		has_video: true,
		original_title: "霸王别姬",
		subtype: "movie",
		directors: [
			{
				avatars: {
					small: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1451727734.81.webp",
					large: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1451727734.81.webp",
					medium: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1451727734.81.webp"
				},
				name_en: "Kaige Chen",
				name: "陈凯歌",
				alt: "https://movie.douban.com/celebrity/1023040/",
				id: "1023040"
			}
		],
		pubdates: [
			"1993-01-01(中国香港)",
			"1993-07-26(中国大陆)"
		],
		year: "1993",
		images: {
			small: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2561716440.webp",
			large: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2561716440.webp",
			medium: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2561716440.webp"
		},
		alt: "https://movie.douban.com/subject/1291546/",
		id: "1291546"
	},
	{
		rating: {
			max: 10,
			average: 9.5,
			details: {
				"1": 1120,
				"2": 2070,
				"3": 32213,
				"4": 243349,
				"5": 905106
			},
			stars: "50",
			min: 0
		},
		genres: [
			"剧情",
			"爱情"
		],
		title: "阿甘正传",
		casts: [
			{
				avatars: {
					small: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p28603.webp",
					large: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p28603.webp",
					medium: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p28603.webp"
				},
				name_en: "Tom Hanks",
				name: "汤姆·汉克斯",
				alt: "https://movie.douban.com/celebrity/1054450/",
				id: "1054450"
			},
			{
				avatars: {
					small: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1537890386.77.webp",
					large: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1537890386.77.webp",
					medium: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1537890386.77.webp"
				},
				name_en: "Robin Wright",
				name: "罗宾·怀特",
				alt: "https://movie.douban.com/celebrity/1002676/",
				id: "1002676"
			},
			{
				avatars: {
					small: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p26315.webp",
					large: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p26315.webp",
					medium: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p26315.webp"
				},
				name_en: "Gary Sinise",
				name: "加里·西尼斯",
				alt: "https://movie.douban.com/celebrity/1031848/",
				id: "1031848"
			}
		],
		durations: [
			"142分钟"
		],
		collect_count: 2298781,
		mainland_pubdate: "",
		has_video: true,
		original_title: "Forrest Gump",
		subtype: "movie",
		directors: [
			{
				avatars: {
					small: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p505.webp",
					large: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p505.webp",
					medium: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p505.webp"
				},
				name_en: "Robert Zemeckis",
				name: "罗伯特·泽米吉斯",
				alt: "https://movie.douban.com/celebrity/1053564/",
				id: "1053564"
			}
		],
		pubdates: [
			"1994-06-23(洛杉矶首映)",
			"1994-07-06(美国)"
		],
		year: "1994",
		images: {
			small: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p1484728154.webp",
			large: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p1484728154.webp",
			medium: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p1484728154.webp"
		},
		alt: "https://movie.douban.com/subject/1292720/",
		id: "1292720"
	},
	{
		rating: {
			max: 10,
			average: 9.4,
			details: {
				"1": 1227,
				"2": 2461,
				"3": 41779,
				"4": 301526,
				"5": 990952
			},
			stars: "50",
			min: 0
		},
		genres: [
			"剧情",
			"动作",
			"犯罪"
		],
		title: "这个杀手不太冷",
		casts: [
			{
				avatars: {
					small: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p8833.webp",
					large: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p8833.webp",
					medium: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p8833.webp"
				},
				name_en: "Jean Reno",
				name: "让·雷诺",
				alt: "https://movie.douban.com/celebrity/1025182/",
				id: "1025182"
			},
			{
				avatars: {
					small: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p2274.webp",
					large: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p2274.webp",
					medium: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p2274.webp"
				},
				name_en: "Natalie Portman",
				name: "娜塔莉·波特曼",
				alt: "https://movie.douban.com/celebrity/1054454/",
				id: "1054454"
			},
			{
				avatars: {
					small: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p33896.webp",
					large: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p33896.webp",
					medium: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p33896.webp"
				},
				name_en: "Gary Oldman",
				name: "加里·奥德曼",
				alt: "https://movie.douban.com/celebrity/1010507/",
				id: "1010507"
			}
		],
		durations: [
			"110分钟(剧场版)",
			"133分钟(国际版)"
		],
		collect_count: 2649176,
		mainland_pubdate: "",
		has_video: true,
		original_title: "Léon",
		subtype: "movie",
		directors: [
			{
				avatars: {
					small: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p33301.webp",
					large: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p33301.webp",
					medium: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p33301.webp"
				},
				name_en: "Luc Besson",
				name: "吕克·贝松",
				alt: "https://movie.douban.com/celebrity/1031876/",
				id: "1031876"
			}
		],
		pubdates: [
			"1994-09-14(法国)"
		],
		year: "1994",
		images: {
			small: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p511118051.webp",
			large: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p511118051.webp",
			medium: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p511118051.webp"
		},
		alt: "https://movie.douban.com/subject/1295644/",
		id: "1295644"
	},
	{
		rating: {
			max: 10,
			average: 9.5,
			details: {
				"1": 818,
				"2": 1390,
				"3": 17219,
				"4": 134126,
				"5": 610993
			},
			stars: "50",
			min: 0
		},
		genres: [
			"剧情",
			"喜剧",
			"爱情"
		],
		title: "美丽人生",
		casts: [
			{
				avatars: {
					small: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p26764.webp",
					large: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p26764.webp",
					medium: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p26764.webp"
				},
				name_en: "Roberto Benigni",
				name: "罗伯托·贝尼尼",
				alt: "https://movie.douban.com/celebrity/1041004/",
				id: "1041004"
			},
			{
				avatars: {
					small: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p9548.webp",
					large: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p9548.webp",
					medium: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p9548.webp"
				},
				name_en: "Nicoletta Braschi",
				name: "尼可莱塔·布拉斯基",
				alt: "https://movie.douban.com/celebrity/1000375/",
				id: "1000375"
			},
			{
				avatars: {
					small: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p45590.webp",
					large: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p45590.webp",
					medium: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p45590.webp"
				},
				name_en: "Giorgio Cantarini",
				name: "乔治·坎塔里尼",
				alt: "https://movie.douban.com/celebrity/1000368/",
				id: "1000368"
			}
		],
		durations: [
			"116分钟",
			"125分钟(戛纳电影节)"
		],
		collect_count: 1305352,
		mainland_pubdate: "2020-01-03",
		has_video: false,
		original_title: "La vita è bella",
		subtype: "movie",
		directors: [
			{
				avatars: {
					small: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p26764.webp",
					large: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p26764.webp",
					medium: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p26764.webp"
				},
				name_en: "Roberto Benigni",
				name: "罗伯托·贝尼尼",
				alt: "https://movie.douban.com/celebrity/1041004/",
				id: "1041004"
			}
		],
		pubdates: [
			"1997-12-20(意大利)",
			"2020-01-03(中国大陆)"
		],
		year: "1997",
		images: {
			small: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2578474613.webp",
			large: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2578474613.webp",
			medium: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2578474613.webp"
		},
		alt: "https://movie.douban.com/subject/1292063/",
		id: "1292063"
	},
	{
		rating: {
			max: 10,
			average: 9.4,
			details: {
				"1": 959,
				"2": 2375,
				"3": 41337,
				"4": 255871,
				"5": 850750
			},
			stars: "50",
			min: 0
		},
		genres: [
			"剧情",
			"爱情",
			"灾难"
		],
		title: "泰坦尼克号",
		casts: [
			{
				avatars: {
					small: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p470.webp",
					large: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p470.webp",
					medium: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p470.webp"
				},
				name_en: "Leonardo DiCaprio",
				name: "莱昂纳多·迪卡普里奥",
				alt: "https://movie.douban.com/celebrity/1041029/",
				id: "1041029"
			},
			{
				avatars: {
					small: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p53358.webp",
					large: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p53358.webp",
					medium: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p53358.webp"
				},
				name_en: "Kate Winslet",
				name: "凯特·温丝莱特",
				alt: "https://movie.douban.com/celebrity/1054446/",
				id: "1054446"
			},
			{
				avatars: {
					small: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p45186.webp",
					large: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p45186.webp",
					medium: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p45186.webp"
				},
				name_en: "Billy Zane",
				name: "比利·赞恩",
				alt: "https://movie.douban.com/celebrity/1031864/",
				id: "1031864"
			}
		],
		durations: [
			"194分钟",
			"227分钟(白星版)"
		],
		collect_count: 2256348,
		mainland_pubdate: "1998-04-03",
		has_video: true,
		original_title: "Titanic",
		subtype: "movie",
		directors: [
			{
				avatars: {
					small: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p33715.webp",
					large: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p33715.webp",
					medium: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p33715.webp"
				},
				name_en: "James Cameron",
				name: "詹姆斯·卡梅隆",
				alt: "https://movie.douban.com/celebrity/1022571/",
				id: "1022571"
			}
		],
		pubdates: [
			"1997-11-01(东京电影节)",
			"1997-12-19(美国)",
			"1998-04-03(中国大陆)"
		],
		year: "1997",
		images: {
			small: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p457760035.webp",
			large: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p457760035.webp",
			medium: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p457760035.webp"
		},
		alt: "https://movie.douban.com/subject/1292722/",
		id: "1292722"
	},
	{
		rating: {
			max: 10,
			average: 9.3,
			details: {
				"1": 1294,
				"2": 2516,
				"3": 45017,
				"4": 297820,
				"5": 881743
			},
			stars: "50",
			min: 0
		},
		genres: [
			"剧情",
			"动画",
			"奇幻"
		],
		title: "千与千寻",
		casts: [
			{
				avatars: {
					small: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1463193210.13.webp",
					large: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1463193210.13.webp",
					medium: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1463193210.13.webp"
				},
				name_en: "Rumi Hiiragi",
				name: "柊瑠美",
				alt: "https://movie.douban.com/celebrity/1023337/",
				id: "1023337"
			},
			{
				avatars: {
					small: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p44986.webp",
					large: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p44986.webp",
					medium: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p44986.webp"
				},
				name_en: "Miyu Irino",
				name: "入野自由",
				alt: "https://movie.douban.com/celebrity/1005438/",
				id: "1005438"
			},
			{
				avatars: {
					small: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1376151005.51.webp",
					large: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1376151005.51.webp",
					medium: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1376151005.51.webp"
				},
				name_en: "Mari Natsuki",
				name: "夏木真理",
				alt: "https://movie.douban.com/celebrity/1045797/",
				id: "1045797"
			}
		],
		durations: [
			"125分钟"
		],
		collect_count: 2247643,
		mainland_pubdate: "2019-06-21",
		has_video: true,
		original_title: "千と千尋の神隠し",
		subtype: "movie",
		directors: [
			{
				avatars: {
					small: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p616.webp",
					large: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p616.webp",
					medium: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p616.webp"
				},
				name_en: "Hayao Miyazaki",
				name: "宫崎骏",
				alt: "https://movie.douban.com/celebrity/1054439/",
				id: "1054439"
			}
		],
		pubdates: [
			"2001-07-20(日本)",
			"2019-06-21(中国大陆)"
		],
		year: "2001",
		images: {
			small: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2557573348.webp",
			large: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2557573348.webp",
			medium: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2557573348.webp"
		},
		alt: "https://movie.douban.com/subject/1291561/",
		id: "1291561"
	},
	{
		rating: {
			max: 10,
			average: 9.5,
			details: {
				"1": 468,
				"2": 774,
				"3": 14271,
				"4": 115372,
				"5": 479413
			},
			stars: "50",
			min: 0
		},
		genres: [
			"剧情",
			"历史",
			"战争"
		],
		title: "辛德勒的名单",
		casts: [
			{
				avatars: {
					small: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p44906.webp",
					large: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p44906.webp",
					medium: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p44906.webp"
				},
				name_en: "Liam Neeson",
				name: "连姆·尼森",
				alt: "https://movie.douban.com/celebrity/1031220/",
				id: "1031220"
			},
			{
				avatars: {
					small: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1374649659.58.webp",
					large: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1374649659.58.webp",
					medium: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1374649659.58.webp"
				},
				name_en: "Ben Kingsley",
				name: "本·金斯利",
				alt: "https://movie.douban.com/celebrity/1054393/",
				id: "1054393"
			},
			{
				avatars: {
					small: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p28941.webp",
					large: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p28941.webp",
					medium: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p28941.webp"
				},
				name_en: "Ralph Fiennes",
				name: "拉尔夫·费因斯",
				alt: "https://movie.douban.com/celebrity/1006956/",
				id: "1006956"
			}
		],
		durations: [
			"195分钟"
		],
		collect_count: 1117317,
		mainland_pubdate: "",
		has_video: true,
		original_title: "Schindler's List",
		subtype: "movie",
		directors: [
			{
				avatars: {
					small: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p617.webp",
					large: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p617.webp",
					medium: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p617.webp"
				},
				name_en: "Steven Spielberg",
				name: "史蒂文·斯皮尔伯格",
				alt: "https://movie.douban.com/celebrity/1054440/",
				id: "1054440"
			}
		],
		pubdates: [
			"1993-11-30(华盛顿首映)",
			"1994-02-04(美国)"
		],
		year: "1993",
		images: {
			small: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p492406163.webp",
			large: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p492406163.webp",
			medium: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p492406163.webp"
		},
		alt: "https://movie.douban.com/subject/1295124/",
		id: "1295124"
	},
	{
		rating: {
			max: 10,
			average: 9.3,
			details: {
				"1": 1620,
				"2": 2776,
				"3": 44253,
				"4": 288651,
				"5": 814549
			},
			stars: "50",
			min: 0
		},
		genres: [
			"剧情",
			"科幻",
			"悬疑"
		],
		title: "盗梦空间",
		casts: [
			{
				avatars: {
					small: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p470.webp",
					large: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p470.webp",
					medium: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p470.webp"
				},
				name_en: "Leonardo DiCaprio",
				name: "莱昂纳多·迪卡普里奥",
				alt: "https://movie.douban.com/celebrity/1041029/",
				id: "1041029"
			},
			{
				avatars: {
					small: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p11006.webp",
					large: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p11006.webp",
					medium: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p11006.webp"
				},
				name_en: "Joseph Gordon-Levitt",
				name: "约瑟夫·高登-莱维特",
				alt: "https://movie.douban.com/celebrity/1101703/",
				id: "1101703"
			},
			{
				avatars: {
					small: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p118.webp",
					large: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p118.webp",
					medium: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p118.webp"
				},
				name_en: "Ellen Page",
				name: "艾伦·佩吉",
				alt: "https://movie.douban.com/celebrity/1012520/",
				id: "1012520"
			}
		],
		durations: [
			"148分钟"
		],
		collect_count: 2215065,
		mainland_pubdate: "2010-09-01",
		has_video: true,
		original_title: "Inception",
		subtype: "movie",
		directors: [
			{
				avatars: {
					small: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p673.webp",
					large: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p673.webp",
					medium: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p673.webp"
				},
				name_en: "Christopher Nolan",
				name: "克里斯托弗·诺兰",
				alt: "https://movie.douban.com/celebrity/1054524/",
				id: "1054524"
			}
		],
		pubdates: [
			"2010-07-16(美国)",
			"2010-09-01(中国大陆)"
		],
		year: "2010",
		images: {
			small: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p513344864.webp",
			large: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p513344864.webp",
			medium: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p513344864.webp"
		},
		alt: "https://movie.douban.com/subject/3541415/",
		id: "3541415"
	},
	{
		rating: {
			max: 10,
			average: 9.4,
			details: {
				"1": 831,
				"2": 2145,
				"3": 33682,
				"4": 183613,
				"5": 588993
			},
			stars: "50",
			min: 0
		},
		genres: [
			"剧情"
		],
		title: "忠犬八公的故事",
		casts: [
			{
				avatars: {
					small: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p33013.webp",
					large: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p33013.webp",
					medium: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p33013.webp"
				},
				name_en: "Richard Gere",
				name: "理查·基尔",
				alt: "https://movie.douban.com/celebrity/1040997/",
				id: "1040997"
			},
			{
				avatars: {
					small: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p5502.webp",
					large: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p5502.webp",
					medium: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p5502.webp"
				},
				name_en: "Sarah Roemer",
				name: "萨拉·罗默尔",
				alt: "https://movie.douban.com/celebrity/1049499/",
				id: "1049499"
			},
			{
				avatars: {
					small: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p17520.webp",
					large: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p17520.webp",
					medium: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p17520.webp"
				},
				name_en: "Joan Allen",
				name: "琼·艾伦",
				alt: "https://movie.douban.com/celebrity/1025215/",
				id: "1025215"
			}
		],
		durations: [
			"93分钟"
		],
		collect_count: 1685269,
		mainland_pubdate: "",
		has_video: true,
		original_title: "Hachi: A Dog's Tale",
		subtype: "movie",
		directors: [
			{
				avatars: {
					small: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p4333.webp",
					large: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p4333.webp",
					medium: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p4333.webp"
				},
				name_en: "Lasse Hallström",
				name: "拉斯·霍尔斯道姆",
				alt: "https://movie.douban.com/celebrity/1018014/",
				id: "1018014"
			}
		],
		pubdates: [
			"2009-06-13(西雅图电影节)",
			"2010-03-12(英国)"
		],
		year: "2009",
		images: {
			small: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p524964016.webp",
			large: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p524964016.webp",
			medium: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p524964016.webp"
		},
		alt: "https://movie.douban.com/subject/3011091/",
		id: "3011091"
	},
	{
		rating: {
			max: 10,
			average: 9.3,
			details: {
				"1": 1575,
				"2": 4200,
				"3": 44749,
				"4": 237785,
				"5": 655057
			},
			stars: "50",
			min: 0
		},
		genres: [
			"剧情",
			"音乐"
		],
		title: "海上钢琴师",
		casts: [
			{
				avatars: {
					small: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p6281.webp",
					large: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p6281.webp",
					medium: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p6281.webp"
				},
				name_en: "Tim Roth",
				name: "蒂姆·罗斯",
				alt: "https://movie.douban.com/celebrity/1025176/",
				id: "1025176"
			},
			{
				avatars: {
					small: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1355152571.6.webp",
					large: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1355152571.6.webp",
					medium: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1355152571.6.webp"
				},
				name_en: "Pruitt Taylor Vince",
				name: "普路特·泰勒·文斯",
				alt: "https://movie.douban.com/celebrity/1010659/",
				id: "1010659"
			},
			{
				avatars: {
					small: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p12333.webp",
					large: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p12333.webp",
					medium: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p12333.webp"
				},
				name_en: "Bill Nunn",
				name: "比尔·努恩",
				alt: "https://movie.douban.com/celebrity/1027407/",
				id: "1027407"
			}
		],
		durations: [
			"165分钟",
			"120分钟(法国版)",
			"169分钟(加长版)",
			"125分钟(中国大陆)"
		],
		collect_count: 1760384,
		mainland_pubdate: "2019-11-15",
		has_video: true,
		original_title: "La leggenda del pianista sull'oceano",
		subtype: "movie",
		directors: [
			{
				avatars: {
					small: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p195.webp",
					large: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p195.webp",
					medium: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p195.webp"
				},
				name_en: "Giuseppe Tornatore",
				name: "朱塞佩·托纳多雷",
				alt: "https://movie.douban.com/celebrity/1018983/",
				id: "1018983"
			}
		],
		pubdates: [
			"1998-10-28(意大利)",
			"2019-11-15(中国大陆)"
		],
		year: "1998",
		images: {
			small: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2574551676.webp",
			large: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2574551676.webp",
			medium: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2574551676.webp"
		},
		alt: "https://movie.douban.com/subject/1292001/",
		id: "1292001"
	},
	{
		rating: {
			max: 10,
			average: 9.3,
			details: {
				"1": 629,
				"2": 1713,
				"3": 30728,
				"4": 183178,
				"5": 536566
			},
			stars: "50",
			min: 0
		},
		genres: [
			"科幻",
			"动画",
			"冒险"
		],
		title: "机器人总动员",
		casts: [
			{
				avatars: {
					small: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p13028.webp",
					large: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p13028.webp",
					medium: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p13028.webp"
				},
				name_en: "Ben Burtt",
				name: "本·贝尔特",
				alt: "https://movie.douban.com/celebrity/1009535/",
				id: "1009535"
			},
			{
				avatars: {
					small: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1519794715.93.webp",
					large: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1519794715.93.webp",
					medium: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1519794715.93.webp"
				},
				name_en: "Elissa Knight",
				name: "艾丽莎·奈特",
				alt: "https://movie.douban.com/celebrity/1000389/",
				id: "1000389"
			},
			{
				avatars: {
					small: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p31068.webp",
					large: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p31068.webp",
					medium: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p31068.webp"
				},
				name_en: "Jeff Garlin",
				name: "杰夫·格尔林",
				alt: "https://movie.douban.com/celebrity/1018022/",
				id: "1018022"
			}
		],
		durations: [
			"98分钟"
		],
		collect_count: 1430378,
		mainland_pubdate: "",
		has_video: true,
		original_title: "WALL·E",
		subtype: "movie",
		directors: [
			{
				avatars: {
					small: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1467359656.96.webp",
					large: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1467359656.96.webp",
					medium: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1467359656.96.webp"
				},
				name_en: "Andrew Stanton",
				name: "安德鲁·斯坦顿",
				alt: "https://movie.douban.com/celebrity/1036450/",
				id: "1036450"
			}
		],
		pubdates: [
			"2008-06-27(美国)"
		],
		year: "2008",
		images: {
			small: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p1461851991.webp",
			large: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p1461851991.webp",
			medium: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p1461851991.webp"
		},
		alt: "https://movie.douban.com/subject/2131459/",
		id: "2131459"
	},
	{
		rating: {
			max: 10,
			average: 9.2,
			details: {
				"1": 2735,
				"2": 5695,
				"3": 56267,
				"4": 274951,
				"5": 724812
			},
			stars: "50",
			min: 0
		},
		genres: [
			"剧情",
			"喜剧",
			"爱情"
		],
		title: "三傻大闹宝莱坞",
		casts: [
			{
				avatars: {
					small: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p13628.webp",
					large: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p13628.webp",
					medium: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p13628.webp"
				},
				name_en: "Aamir Khan",
				name: "阿米尔·汗",
				alt: "https://movie.douban.com/celebrity/1031931/",
				id: "1031931"
			},
			{
				avatars: {
					small: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p5568.webp",
					large: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p5568.webp",
					medium: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p5568.webp"
				},
				name_en: "Kareena Kapoor",
				name: "卡琳娜·卡普尔",
				alt: "https://movie.douban.com/celebrity/1049635/",
				id: "1049635"
			},
			{
				avatars: {
					small: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p5651.webp",
					large: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p5651.webp",
					medium: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p5651.webp"
				},
				name_en: "R. Madhavan",
				name: "马达范",
				alt: "https://movie.douban.com/celebrity/1018290/",
				id: "1018290"
			}
		],
		durations: [
			"171分钟(印度)"
		],
		collect_count: 1978257,
		mainland_pubdate: "2011-12-08",
		has_video: true,
		original_title: "3 Idiots",
		subtype: "movie",
		directors: [
			{
				avatars: {
					small: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p16549.webp",
					large: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p16549.webp",
					medium: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p16549.webp"
				},
				name_en: "Rajkumar Hirani",
				name: "拉吉库马尔·希拉尼",
				alt: "https://movie.douban.com/celebrity/1286677/",
				id: "1286677"
			}
		],
		pubdates: [
			"2009-12-25(印度)",
			"2011-12-08(中国大陆)"
		],
		year: "2009",
		images: {
			small: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p579729551.webp",
			large: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p579729551.webp",
			medium: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p579729551.webp"
		},
		alt: "https://movie.douban.com/subject/3793023/",
		id: "3793023"
	},
	{
		rating: {
			max: 10,
			average: 9.3,
			details: {
				"1": 682,
				"2": 1911,
				"3": 35150,
				"4": 235782,
				"5": 591992
			},
			stars: "50",
			min: 0
		},
		genres: [
			"剧情",
			"科幻"
		],
		title: "楚门的世界",
		casts: [
			{
				avatars: {
					small: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p615.webp",
					large: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p615.webp",
					medium: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p615.webp"
				},
				name_en: "Jim Carrey",
				name: "金·凯瑞",
				alt: "https://movie.douban.com/celebrity/1054438/",
				id: "1054438"
			},
			{
				avatars: {
					small: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p38385.webp",
					large: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p38385.webp",
					medium: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p38385.webp"
				},
				name_en: "Laura Linney",
				name: "劳拉·琳妮",
				alt: "https://movie.douban.com/celebrity/1053572/",
				id: "1053572"
			},
			{
				avatars: {
					small: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1485163747.76.webp",
					large: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1485163747.76.webp",
					medium: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1485163747.76.webp"
				},
				name_en: "Ed Harris",
				name: "艾德·哈里斯",
				alt: "https://movie.douban.com/celebrity/1048024/",
				id: "1048024"
			}
		],
		durations: [
			"103分钟"
		],
		collect_count: 1567437,
		mainland_pubdate: "",
		has_video: true,
		original_title: "The Truman Show",
		subtype: "movie",
		directors: [
			{
				avatars: {
					small: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p4360.webp",
					large: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p4360.webp",
					medium: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p4360.webp"
				},
				name_en: "Peter Weir",
				name: "彼得·威尔",
				alt: "https://movie.douban.com/celebrity/1022721/",
				id: "1022721"
			}
		],
		pubdates: [
			"1998-06-05(美国)"
		],
		year: "1998",
		images: {
			small: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p479682972.webp",
			large: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p479682972.webp",
			medium: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p479682972.webp"
		},
		alt: "https://movie.douban.com/subject/1292064/",
		id: "1292064"
	},
	{
		rating: {
			max: 10,
			average: 9.3,
			details: {
				"1": 406,
				"2": 1275,
				"3": 28203,
				"4": 199327,
				"5": 515426
			},
			stars: "50",
			min: 0
		},
		genres: [
			"剧情",
			"音乐"
		],
		title: "放牛班的春天",
		casts: [
			{
				avatars: {
					small: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p3363.webp",
					large: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p3363.webp",
					medium: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p3363.webp"
				},
				name_en: "Gérard Jugnot",
				name: "热拉尔·朱尼奥",
				alt: "https://movie.douban.com/celebrity/1048281/",
				id: "1048281"
			},
			{
				avatars: {
					small: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p9329.webp",
					large: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p9329.webp",
					medium: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p9329.webp"
				},
				name_en: "François Berléand",
				name: "弗朗索瓦·贝莱昂",
				alt: "https://movie.douban.com/celebrity/1054351/",
				id: "1054351"
			},
			{
				avatars: {
					small: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p44424.webp",
					large: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p44424.webp",
					medium: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p44424.webp"
				},
				name_en: "Kad Merad",
				name: "凯德·麦拉德",
				alt: "https://movie.douban.com/celebrity/1000491/",
				id: "1000491"
			}
		],
		durations: [
			"97分钟"
		],
		collect_count: 1463671,
		mainland_pubdate: "2004-10-16",
		has_video: true,
		original_title: "Les choristes",
		subtype: "movie",
		directors: [
			{
				avatars: {
					small: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p24744.webp",
					large: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p24744.webp",
					medium: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p24744.webp"
				},
				name_en: "Christophe Barratier",
				name: "克里斯托夫·巴拉蒂",
				alt: "https://movie.douban.com/celebrity/1277959/",
				id: "1277959"
			}
		],
		pubdates: [
			"2004-03-17(法国)",
			"2004-10-16(中国大陆)"
		],
		year: "2004",
		images: {
			small: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p1910824951.webp",
			large: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p1910824951.webp",
			medium: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p1910824951.webp"
		},
		alt: "https://movie.douban.com/subject/1291549/",
		id: "1291549"
	},
	{
		rating: {
			max: 10,
			average: 9.3,
			details: {
				"1": 2699,
				"2": 3967,
				"3": 40857,
				"4": 208464,
				"5": 620738
			},
			stars: "50",
			min: 0
		},
		genres: [
			"剧情",
			"科幻",
			"冒险"
		],
		title: "星际穿越",
		casts: [
			{
				avatars: {
					small: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1392653727.04.webp",
					large: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1392653727.04.webp",
					medium: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1392653727.04.webp"
				},
				name_en: "Matthew McConaughey",
				name: "马修·麦康纳",
				alt: "https://movie.douban.com/celebrity/1040511/",
				id: "1040511"
			},
			{
				avatars: {
					small: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p49634.webp",
					large: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p49634.webp",
					medium: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p49634.webp"
				},
				name_en: "Anne Hathaway",
				name: "安妮·海瑟薇",
				alt: "https://movie.douban.com/celebrity/1048027/",
				id: "1048027"
			},
			{
				avatars: {
					small: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p54076.webp",
					large: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p54076.webp",
					medium: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p54076.webp"
				},
				name_en: "Jessica Chastain",
				name: "杰西卡·查斯坦",
				alt: "https://movie.douban.com/celebrity/1000225/",
				id: "1000225"
			}
		],
		durations: [
			"169分钟"
		],
		collect_count: 1548712,
		mainland_pubdate: "2014-11-12",
		has_video: true,
		original_title: "Interstellar",
		subtype: "movie",
		directors: [
			{
				avatars: {
					small: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p673.webp",
					large: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p673.webp",
					medium: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p673.webp"
				},
				name_en: "Christopher Nolan",
				name: "克里斯托弗·诺兰",
				alt: "https://movie.douban.com/celebrity/1054524/",
				id: "1054524"
			}
		],
		pubdates: [
			"2014-11-07(美国)",
			"2014-11-12(中国大陆)"
		],
		year: "2014",
		images: {
			small: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2206088801.webp",
			large: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2206088801.webp",
			medium: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2206088801.webp"
		},
		alt: "https://movie.douban.com/subject/1889243/",
		id: "1889243"
	},
	{
		rating: {
			max: 10,
			average: 9.2,
			details: {
				"1": 2072,
				"2": 3827,
				"3": 49563,
				"4": 221131,
				"5": 559998
			},
			stars: "45",
			min: 0
		},
		genres: [
			"喜剧",
			"爱情",
			"奇幻"
		],
		title: "大话西游之大圣娶亲",
		casts: [
			{
				avatars: {
					small: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p47421.webp",
					large: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p47421.webp",
					medium: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p47421.webp"
				},
				name_en: "Stephen Chow",
				name: "周星驰",
				alt: "https://movie.douban.com/celebrity/1048026/",
				id: "1048026"
			},
			{
				avatars: {
					small: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p45481.webp",
					large: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p45481.webp",
					medium: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p45481.webp"
				},
				name_en: "Man Tat Ng",
				name: "吴孟达",
				alt: "https://movie.douban.com/celebrity/1016771/",
				id: "1016771"
			},
			{
				avatars: {
					small: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p49237.webp",
					large: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p49237.webp",
					medium: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p49237.webp"
				},
				name_en: "Athena Chu",
				name: "朱茵",
				alt: "https://movie.douban.com/celebrity/1041734/",
				id: "1041734"
			}
		],
		durations: [
			"95分钟",
			"110分钟(重映版)"
		],
		collect_count: 1650382,
		mainland_pubdate: "2014-10-24",
		has_video: true,
		original_title: "西遊記大結局之仙履奇緣",
		subtype: "movie",
		directors: [
			{
				avatars: {
					small: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p45374.webp",
					large: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p45374.webp",
					medium: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p45374.webp"
				},
				name_en: "Jeffrey Lau",
				name: "刘镇伟",
				alt: "https://movie.douban.com/celebrity/1274431/",
				id: "1274431"
			}
		],
		pubdates: [
			"1995-02-04(中国香港)",
			"2014-10-24(中国大陆)",
			"2017-04-13(中国大陆重映)"
		],
		year: "1995",
		images: {
			small: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2455050536.webp",
			large: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2455050536.webp",
			medium: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2455050536.webp"
		},
		alt: "https://movie.douban.com/subject/1292213/",
		id: "1292213"
	},
	{
		rating: {
			max: 10,
			average: 9.3,
			details: {
				"1": 564,
				"2": 1156,
				"3": 18985,
				"4": 138813,
				"5": 376119
			},
			stars: "50",
			min: 0
		},
		genres: [
			"剧情"
		],
		title: "熔炉",
		casts: [
			{
				avatars: {
					small: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1397060788.93.webp",
					large: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1397060788.93.webp",
					medium: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1397060788.93.webp"
				},
				name_en: "Yoo Gong",
				name: "孔侑",
				alt: "https://movie.douban.com/celebrity/1011009/",
				id: "1011009"
			},
			{
				avatars: {
					small: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1409765749.47.webp",
					large: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1409765749.47.webp",
					medium: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1409765749.47.webp"
				},
				name_en: "Yu-mi Jung",
				name: "郑有美",
				alt: "https://movie.douban.com/celebrity/1276062/",
				id: "1276062"
			},
			{
				avatars: {
					small: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1393488191.45.webp",
					large: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1393488191.45.webp",
					medium: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1393488191.45.webp"
				},
				name_en: "Jee-young Kim",
				name: "金志映",
				alt: "https://movie.douban.com/celebrity/1331104/",
				id: "1331104"
			}
		],
		durations: [
			"125分钟"
		],
		collect_count: 888190,
		mainland_pubdate: "",
		has_video: false,
		original_title: "도가니",
		subtype: "movie",
		directors: [
			{
				avatars: {
					small: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p52558.webp",
					large: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p52558.webp",
					medium: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p52558.webp"
				},
				name_en: "Dong-hyuk Hwang",
				name: "黄东赫",
				alt: "https://movie.douban.com/celebrity/1317274/",
				id: "1317274"
			}
		],
		pubdates: [
			"2011-09-22(韩国)"
		],
		year: "2011",
		images: {
			small: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p1363250216.webp",
			large: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p1363250216.webp",
			medium: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p1363250216.webp"
		},
		alt: "https://movie.douban.com/subject/5912992/",
		id: "5912992"
	},
	{
		rating: {
			max: 10,
			average: 9.2,
			details: {
				"1": 935,
				"2": 2329,
				"3": 52230,
				"4": 316834,
				"5": 667866
			},
			stars: "45",
			min: 0
		},
		genres: [
			"喜剧",
			"动画",
			"冒险"
		],
		title: "疯狂动物城",
		casts: [
			{
				avatars: {
					small: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p4815.webp",
					large: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p4815.webp",
					medium: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p4815.webp"
				},
				name_en: "Ginnifer Goodwin",
				name: "金妮弗·古德温",
				alt: "https://movie.douban.com/celebrity/1017930/",
				id: "1017930"
			},
			{
				avatars: {
					small: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p18772.webp",
					large: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p18772.webp",
					medium: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p18772.webp"
				},
				name_en: "Jason Bateman",
				name: "杰森·贝特曼",
				alt: "https://movie.douban.com/celebrity/1013760/",
				id: "1013760"
			},
			{
				avatars: {
					small: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1410696282.74.webp",
					large: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1410696282.74.webp",
					medium: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1410696282.74.webp"
				},
				name_en: "Idris Elba",
				name: "伊德里斯·艾尔巴",
				alt: "https://movie.douban.com/celebrity/1049501/",
				id: "1049501"
			}
		],
		durations: [
			"109分钟(中国大陆)",
			"108分钟"
		],
		collect_count: 1889927,
		mainland_pubdate: "2016-03-04",
		has_video: true,
		original_title: "Zootopia",
		subtype: "movie",
		directors: [
			{
				avatars: {
					small: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1457505519.94.webp",
					large: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1457505519.94.webp",
					medium: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1457505519.94.webp"
				},
				name_en: "Byron Howard",
				name: "拜伦·霍华德",
				alt: "https://movie.douban.com/celebrity/1286985/",
				id: "1286985"
			},
			{
				avatars: {
					small: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1457505501.8.webp",
					large: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1457505501.8.webp",
					medium: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1457505501.8.webp"
				},
				name_en: "Rich Moore",
				name: "瑞奇·摩尔",
				alt: "https://movie.douban.com/celebrity/1324037/",
				id: "1324037"
			},
			{
				avatars: {
					small: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1456810614.66.webp",
					large: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1456810614.66.webp",
					medium: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1456810614.66.webp"
				},
				name_en: "Jared Bush",
				name: "杰拉德·布什",
				alt: "https://movie.douban.com/celebrity/1304069/",
				id: "1304069"
			}
		],
		pubdates: [
			"2016-03-04(中国大陆)",
			"2016-03-04(美国)"
		],
		year: "2016",
		images: {
			small: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2315672647.webp",
			large: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2315672647.webp",
			medium: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2315672647.webp"
		},
		alt: "https://movie.douban.com/subject/25662329/",
		id: "25662329"
	},
	{
		rating: {
			max: 10,
			average: 9.2,
			details: {
				"1": 417,
				"2": 1306,
				"3": 33447,
				"4": 204931,
				"5": 454428
			},
			stars: "50",
			min: 0
		},
		genres: [
			"剧情",
			"犯罪",
			"悬疑"
		],
		title: "无间道",
		casts: [
			{
				avatars: {
					small: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1378956633.91.webp",
					large: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1378956633.91.webp",
					medium: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1378956633.91.webp"
				},
				name_en: "Andy Lau",
				name: "刘德华",
				alt: "https://movie.douban.com/celebrity/1054424/",
				id: "1054424"
			},
			{
				avatars: {
					small: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p33525.webp",
					large: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p33525.webp",
					medium: "https://img9.doubanio.com/view/celebrity/s_ratio_celebrity/public/p33525.webp"
				},
				name_en: "Tony Leung Chiu Wai",
				name: "梁朝伟",
				alt: "https://movie.douban.com/celebrity/1115918/",
				id: "1115918"
			},
			{
				avatars: {
					small: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p24841.webp",
					large: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p24841.webp",
					medium: "https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p24841.webp"
				},
				name_en: "Anthony Wong Chau-Sang",
				name: "黄秋生",
				alt: "https://movie.douban.com/celebrity/1050076/",
				id: "1050076"
			}
		],
		durations: [
			"101分钟",
			"97分钟(导演剪辑版)"
		],
		collect_count: 1362127,
		mainland_pubdate: "2003-09-05",
		has_video: true,
		original_title: "無間道",
		subtype: "movie",
		directors: [
			{
				avatars: {
					small: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1403267018.07.webp",
					large: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1403267018.07.webp",
					medium: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1403267018.07.webp"
				},
				name_en: "Andrew Lau",
				name: "刘伟强",
				alt: "https://movie.douban.com/celebrity/1106979/",
				id: "1106979"
			},
			{
				avatars: {
					small: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p3547.webp",
					large: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p3547.webp",
					medium: "https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p3547.webp"
				},
				name_en: "Alan Mak",
				name: "麦兆辉",
				alt: "https://movie.douban.com/celebrity/1126158/",
				id: "1126158"
			}
		],
		pubdates: [
			"2002-12-12(中国香港)",
			"2003-09-05(中国大陆)"
		],
		year: "2002",
		images: {
			small: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2564556863.webp",
			large: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2564556863.webp",
			medium: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2564556863.webp"
		},
		alt: "https://movie.douban.com/subject/1307914/",
		id: "1307914"
	}
];
var title = "豆瓣电影Top250";
var MovieData = {
	count: count,
	start: start,
	total: total,
	subjects: subjects,
	title: title
};

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const frameWidth = 200;
const frameHeight = 300;
const padding = 20;
class MovieVH extends doric.ViewHolder {
    build(root) {
        doric.vlayout([
            this.title = doric.text({
                layoutConfig: {
                    widthSpec: doric.LayoutSpec.MOST,
                    heightSpec: doric.LayoutSpec.JUST,
                },
                textSize: 30,
                textColor: doric.Color.WHITE,
                backgroundColor: colors[1],
                textAlignment: doric.gravity().center(),
                height: 50,
            }),
            this.scrolled = doric.scroller(this.gallery = doric.hlayout([], {
                layoutConfig: doric.layoutConfig().fit(),
                space: 0,
                padding: {
                    top: 20,
                    left: 20,
                    right: 20,
                    bottom: 20,
                },
                gravity: doric.Gravity.Center,
            }), {
                layoutConfig: doric.layoutConfig().most().configHeight(doric.LayoutSpec.FIT),
                backgroundColor: doric.Color.parse("#eeeeee"),
            }),
            doric.vlayout([
                doric.stack([
                    this.anchor = doric.image({
                        imageBase64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAANb0lEQVR4Xu2de6wcVR3Hv7+9tyTEQLhzS0zUINg7W6Lwjw9QEF9Ay5vykoeI4ut2ZyExJhqNMaIxJBgjiXRnKSjlTWmhtLQ8W4q8hZqYaATc2SbgH8aE7rkYjRrp3WMutFAovTtzdubMnD3f+++e3+N8fueTvfuaEfCPBEhgnwSEbEiABPZNgILwdJDAPAQoCI8HCVAQngESMCPAZxAzbozyhAAF8WTQ3KYZAQpixo1RnhCgIJ4Mmts0I0BBzLgxyhMCFMSTQXObZgQoiBk3RnlCgIJ4Mmhu04wABTHjxihPCFAQTwbNbZoRoCBm3BjlCQEK4smguU0zAhTEjBujPCFAQTwZNLdpRoCCmHFjlCcEKIgng+Y2zQhQEDNujPKEAAXxZNDcphkBCmLGjVGeEKAgngya2zQjQEHMuDHKEwIUxJNBc5tmBCiIGTdGeUKAgngyaG7TjAAFMePGKE8IUBBPBs1tmhGgIGbcGOUJAQriyaC5TTMCFMSMG6M8IUBBPBk0t2lGgIKYcWOUJwQoiCeD5jbNCFAQM26M8oQABSl50BPt7hG12Z2L9NjYpO7rhXPtSE121DR26LHxTm/6sBdLbtHr8hSkhPEvXJF8dHZMzhatzwRwxPwtyDbR/Q2zNbn/1Ub4hxLa9bokBbE4/oPaLxxa0+OXA/pyQBZkKi34H/q4pq9fu+bVyz78cqZYLjYmQEGM0WULnIyTi7XGLyB4b7bIvVb/XYCf9aKwNWQehqcgQEFSQBp2SRAn3wZw9bB59owXjdt6zfDiPHMy194EKEjBp2KynTyqNT5XTBnZqqKp44vJzayvv2FCDMURmIyT32rgs8VVeD3zVhWFlKQgyBSkILBBO3kMGp8pKP3b02r9iGrWT7BSy7MiFKSAgQdx53FAjisg9Twp9RYV1U+0W3P0q1GQnGccxJ0nAPl0zmnTpdPYrJrhknSLuSoNAQqShlLKNUGcPAng2JTLi1r2sIrCpUUl9y0vBclp4kG7+yS0LluO3bt5SEXhSTltzes0FCSH8Qdx8hSAY3JIlWMKeVBFUyfnmNDLVBRkyLEH7eRpaHxqyDTFhGs8qJohJRmCLgUZAl4QJ88A+OQQKWyEPqCi8BQbhUaxBgUxnGoQJ78DcLRhuN0wre9XzfqpdouORjUKYjDHIO48C8hRBqElhsh9Kpo6rcQGnCxNQTKOLYg7zwHyiYxhlVguwKZeFJ5eiWYcaYKCZBhUEHefA7STcuzepgAbe1F4RoZte72UgqQcf9DuboPWH0+5vNLLRGNjr0lJ0gyJgqSgNBEnvxfgYymWOrNEA/fOROHcT375Nw8BCjLgeIzSM8c7t6o1Nsw0w2U0ZN8EKMg8pyNoJdsgGIl/q/a1TQ2sn4nCsyjJuxOgIPs4GaPwgjz1oddyj2pOnZ16vUcLKci7DNvlt3LNz66sU9HUOebxoxlJQd4x1yBOngXg2IeAOR1OrdepZp2S7IGTguwBw6mvj+TkxN5p9N0qqp9bWHrHElOQXQOjHHucXI27VDM8z7GzXEi7FASAI9/KLeQAzJN0rYrCL9ouWrV63gtCOeY5koI1qhGeX7VDa7MfrwWp9I+dbJ6CeWvJnSqauqAy7VhuxFtBglbyNKSivwS0fAgGlhNZrRpTFw5cN4ILvBSkmr8hr/rp0qtVVPdOEu8EqdjVR6puxdv7E32HatQvcqvp4br1SpCKXLdquImVHC3A7b0o/FLJbVgr740gQdx9AtDlXPHQ2jjtFBLBbb2GH7de8EKQUi8HaufMWq8iwK29KPyy9cKWC468IEHcfRzQli8kbXmKJZXTgltmGuElJZW3UnakBbF6CwIr46peEQ3cMhONriQjK0jQSh6DWLo/R/XOrdWONHDzTBR+xWpRS8VGUhBLd3ayNCJXyuibVFT/qivdpu1z5AShHGlHX8A6kRtVY+rSAjKXlnKkBJmMk0c1irphZmkzcq3wKhWFX3Ot6X31OzKCTMTJo0I5qnEuBTeoRvj1ajQzXBcjIchEnGwV4PPDoWB0rgS0vkE1685L4rwglCPXY513st+oKPxG3klt5nNakCBOHgHwBZvAWCszgV+rKPxm5qiKBDgrSNDuboHWx1eEI9uYj4DgetUIv+UiJCcFCdqdLdBCOZw6cXKdiqamnWoZgHOCBHF3M6BPcA00+507bbJSNaaWu8TCKUGCuLMZEMrh0gnbq1d9nYrqzjyTOCNI0E4ehsaJTp8NNr+LgDuSOCFI0Oo8DBHKMUqCaVyvmtV/4V55QYI4eQjAklE6G9zLLgIOvLtVaUGCOHkQwFIeqJEmUOnPSSorCOUYaSneubnKSlJJQYI4eQDASV4dEW62kl9LqZwgQSt5AEI5vPSlgl9wrJQgQZzcD+BkLw8HN/0GAY0bVLM6X5WvjCCUg4a8RUCvUlG9Ej+6qoQgQatzH0RO4REhgT0IVOKXiaULEsTdTYA+lUeDBPYiIPpG1aiX+hv3UgUJ4s4mQCgH3dg3gZIvBFGaIJNxslEDp/FskMBgAuVdUqgUQSbjzkYNoRyDTwZX7P56Y0kXp7MuyGSc3KuB0zl5EshKoIwrOFoVZLKV3KuFcmQ9GFy/xxvAlq8FbE2QiTjZIMAZHDYJDEvA5lXlrQgy0e6uF63PHBYM40lgNwFb9ycpXJCJVrJeBJSDZzt3AjYkKVSQibh7j0Avy50ME5LALgJF3w6uMEEm4uQeASgHj3LhBAT69l5UL+TGooUIErS66yD6rMLJsAAJ7H4mKejuu7kLErQ66yBCOXh07RMo4D7uuQoSxN27AX22fTKsSAJvvii5QzWmLsqLR26CBHFyF4Bz8mqMeUjAnIBeraL6hebxb0XmIgjlyGMUzJEzgTtVFF4wbM6hBQnayVponDtsI4wngQIIDC3JUIIErWQthHIUMFimzIuAxhrVDM83TWcsSBAnawCcZ1qYcSRgjYBgjWqYSWIkyGSrc5UW+Z61DbIQCQxJQICrelH4/axpMgsStLrnQ/TqrIW4ngRKJ6D7F6jm4juz9JFJkIOv3R7O9vubAXwwSxGuJYFqEJCXxmqy5JXli5K0/WQShF8hSYuV66pLQNapaCr153WpBZlYuf1Ime3/sbobZ2ckkI6A6P5RvebibWlWpxYkaHV+BJGfpknKNSRQaQKCq1Uj/E6aHtMLEicvAzgkTVKuIYGKE/ibisL3p+kxlSATcedUgWxKk5BrSMAFAoL+Wb1o8fpBvaYUJLlSgB8MSsbHScAVAhq4ciYKfzio37SCrBCgOSgZHycBVwhojRUzzfDyQf2mFeQmAS4ZlIyPk4A7BNJdzjSVIEG7uw6aP6F1Z/jsdDCBdJ+HpBSkswVajh9clCtIwBUCeouK6icO6jadIHH354D+7qBkfJwEnCGQ8rOQdIK0k6XQmLtnOf9IYCQISB/LepeFGwZtJp0gv0oOxDh6AMYHJeTjJOAAgZ16rLZwZnrRPwb1mkqQuSRBnMw9gywdlJCPk4ADBLaqKEz1mjq9IO3kx9C4woHNs0USmJ+AxhWqGf4kDabUgmDNn/cLduz3OICj0yTmGhKoJAGNZ9X41HGYltfS9JdeEACTK5IzdQ0Dv7+SpjDXkEAZBKQ/u6x32eEDX5zv7i2TIK+/Fml1roXIdBmbY00SGIqA1itVs748S47Mgkys3H6I9PuboHFklkJcSwKlEhD5k67JaTPTi/6apY/MgswlP6j9wqE1veBWQB+bpRjXkkApBDSe6dfGL3q1cdhLWesbCTJX5ICVf1m4YGftFghOylqU60nAIoGHXht7z8X/nH7fDpOaxoLMFfvAL5/e/9/7H3wzLz1qgp4xFgisPXD/8UteuvSw/5rWGkqQ3UWDVrIEoi8FZOiLBZtuhHEk8CYBkTsgtVVq+YfmLlE11F8ugrwlSveYN0TRxwGyeKjOGEwCWQgIngfkKYhepZaHz2QJnW9troLsWWjhVS8egAPG67Na6oKdlCXtxGo1nXap9+s0nu/XxjoLZv+z/ZXmR/5VBI/CBCmiWeYkAdsEKIht4qznFAEK4tS42KxtAhTENnHWc4oABXFqXGzWNgEKYps46zlFgII4NS42a5sABbFNnPWcIkBBnBoXm7VNgILYJs56ThGgIE6Ni83aJkBBbBNnPacIUBCnxsVmbROgILaJs55TBCiIU+Nis7YJUBDbxFnPKQIUxKlxsVnbBCiIbeKs5xQBCuLUuNisbQIUxDZx1nOKAAVxalxs1jYBCmKbOOs5RYCCODUuNmubAAWxTZz1nCJAQZwaF5u1TYCC2CbOek4RoCBOjYvN2iZAQWwTZz2nCFAQp8bFZm0ToCC2ibOeUwQoiFPjYrO2CVAQ28RZzykCFMSpcbFZ2wQoiG3irOcUAQri1LjYrG0CFMQ2cdZzigAFcWpcbNY2AQpimzjrOUWAgjg1LjZrmwAFsU2c9ZwiQEGcGhebtU2AgtgmznpOEaAgTo2LzdomQEFsE2c9pwhQEKfGxWZtE6AgtomznlMEKIhT42KztglQENvEWc8pAhTEqXGxWdsEKIht4qznFAEK4tS42KxtAhTENnHWc4oABXFqXGzWNgEKYps46zlF4P96ztDnxVFciwAAAABJRU5ErkJggg==",
                        layoutConfig: doric.layoutConfig().just(),
                        width: 30,
                        height: 30,
                    }),
                ], {
                    layoutConfig: doric.layoutConfig().fit().configWidth(doric.LayoutSpec.MOST),
                }),
                this.movieTitle = doric.text({
                    textSize: 20,
                }),
                this.movieYear = doric.text({
                    textSize: 20,
                }),
            ], {
                layoutConfig: doric.layoutConfig().fit().configWidth(doric.LayoutSpec.MOST),
                gravity: doric.Gravity.Center
            }),
        ], {
            layoutConfig: doric.layoutConfig().most(),
            space: 0,
        }).in(root);
    }
}
class MovieVM extends doric.ViewModel {
    constructor() {
        super(...arguments);
        this.images = new Map;
    }
    onAttached(state, vh) {
        doric.network(context).get("https://douban.uieee.com/v2/movie/top250").then(ret => {
            this.updateState(state => state.doubanModel = JSON.parse(ret.data));
        });
        this.updateState(state => {
            state.anchorPos = padding + frameWidth / 2;
            state.selectedIdx = 0;
        });
        let scrollX = 0;
        vh.scrolled.onScroll = (offset) => {
            var _a;
            if (offset.x < 0 || offset.x > (((_a = state.doubanModel) === null || _a === void 0 ? void 0 : _a.count) || 0) * frameWidth + padding * 2 - Environment.screenWidth) {
                return;
            }
            const dx = offset.x - scrollX;
            scrollX = offset.x;
            const idx = Math.floor((offset.x + state.anchorPos - padding) / frameWidth);
            if (state.selectedIdx !== idx) {
                this.updateState(state => state.selectedIdx = idx);
            }
            doric.takeNonNull(this.images.get(idx))(it => {
                const scale = (offset.x + state.anchorPos - (idx + 0.5) * frameWidth - padding) / (frameWidth / 2);
                it.scaleX = it.scaleY = 1.5 - Math.abs(scale * 0.5);
            });
            this.updateArrow();
        };
    }
    updateArrow() {
        doric.takeNonNull(this.images.get(this.getState().selectedIdx))(it => {
            it.getLocationOnScreen(context).then(ret => {
                this.getViewHolder().anchor.centerX = ret.x + frameWidth / 2;
            });
        });
    }
    onItemClicked(idx) {
        var _a, _b;
        doric.takeNonNull((_a = this.images.get(this.getState().selectedIdx)) === null || _a === void 0 ? void 0 : _a.superview)(it => {
            it.scaleX = it.scaleY = 1;
        });
        doric.takeNonNull((_b = this.images.get(idx)) === null || _b === void 0 ? void 0 : _b.superview)(it => {
            it.getLocationOnScreen(context).then(ret => {
                let anchor = this.getState().anchorPos;
                if (ret.x < 0) {
                    this.getViewHolder().scrolled.scrollBy(context, { x: ret.x, y: 0 }, true);
                    anchor = frameWidth / 2;
                }
                else if (ret.x > Environment.screenWidth - frameWidth) {
                    this.getViewHolder().scrolled.scrollBy(context, { x: ret.x - (Environment.screenWidth - frameWidth), y: 0 }, true);
                    anchor = Environment.screenWidth - frameWidth / 2;
                }
                else {
                    anchor = ret.x + frameWidth / 2;
                }
                this.updateState(state => {
                    state.selectedIdx = idx;
                    state.anchorPos = anchor;
                });
            });
        });
    }
    onBind(state, vh) {
        if (state.doubanModel) {
            vh.title.text = state.doubanModel.title;
            vh.gallery.children.length = 0;
            const vm = this;
            state.doubanModel.subjects.forEach((e, idx) => {
                vh.gallery.addChild(doric.stack([
                    doric.image({
                        layoutConfig: doric.layoutConfig().just().configAlignment(doric.Gravity.Center),
                        width: frameWidth / 1.5,
                        height: frameHeight / 1.5,
                        imageUrl: e.images.large,
                        onClick: function () {
                            const v = this.superview;
                            if (v == undefined) {
                                return;
                            }
                            vm.onItemClicked(idx);
                        },
                    }).also(it => {
                        this.images.set(idx, it);
                        if (state.selectedIdx == idx) {
                            it.scaleX = it.scaleY = 1.5;
                        }
                    })
                ], {
                    layoutConfig: doric.layoutConfig().just(),
                    width: frameWidth,
                    height: frameHeight,
                }));
            });
            doric.takeNonNull(state.doubanModel.subjects[state.selectedIdx])(it => {
                vh.movieTitle.text = it.title;
                vh.movieYear.text = it.year;
            });
        }
        vh.anchor.centerX = state.anchorPos;
        this.updateArrow();
    }
}
let SliderPanel = class SliderPanel extends doric.VMPanel {
    getViewModelClass() {
        return MovieVM;
    }
    getViewHolderClass() {
        return MovieVH;
    }
    getState() {
        return { selectedIdx: 0, anchorPos: Environment.screenWidth / 2, doubanModel: MovieData };
    }
};
SliderPanel = __decorate([
    Entry
], SliderPanel);
//# sourceMappingURL=ScrolledSliderDemo.js.map
