import { denoCacheDir } from 'jsr:@denosaurs/plug@1/util';
import { parse } from 'culori';
import { hsl, rgbToHsl } from '../src/palleteFuncs.ts';
import { drawHslWheel } from '../VibeCoded/wheelImager.ts';
const colors = [
	'https://coolors.co/2d3142-4f5d75-bfc0c0-ffffff-ef8354',
	'https://coolors.co/6b717e-efaac4-ffc4d1-ffe8e1-d4dccd',
	'https://coolors.co/493b2a-593f62-7b6d8d-8499b1-a5c4d4',
	'https://coolors.co/050505-1b9aaa-dddbcb-f5f1e3-ffffff',
	'https://coolors.co/d3c1c3-e2d0be-eee5bf-e8f8c1-d1ffc6',
	'https://coolors.co/f1e3f3-c2bbf0-8fb8ed-62bfed-3590f3',
	'https://coolors.co/50514f-cbd4c2-fffcff-247ba0-c3b299',
	'https://coolors.co/6a8d73-f4fdd9-e4ffe1-ffe8c2-f0a868',
	'https://coolors.co/94b9af-90a583-9d8420-942911-593837',
	'https://coolors.co/1a535c-4ecdc4-f7fff7-ff6b6b-ffe66d',
	'https://coolors.co/c9cebd-b2bcaa-838e83-6c6061-64403e',
	'https://coolors.co/031926-468189-77aca2-9dbebb-f4e9cd',
	'https://coolors.co/d0f1bf-b6d7b9-9abd97-646536-483d03',
	'https://coolors.co/08415c-cc2936-ebbab9-388697-b5ffe1',
	'https://coolors.co/f7f7f2-e4e6c3-899878-222725-121113',
	'https://coolors.co/040303-3a4e48-6a7b76-8b9d83-beb0a7',
	'https://coolors.co/b3001b-262626-255c99-7ea3cc-ccad8f',
	'https://coolors.co/ceb992-73937e-585563-5b2e48-471323',
	'https://coolors.co/c1c1c1-2c4251-d16666-b6c649-ffffff',
	'https://coolors.co/fc9f5b-fbd1a2-ece4b7-7dcfb6-33ca7f',
	'https://coolors.co/704e2e-79745c-e6f8b2-cde77f-709176',
	'https://coolors.co/db5461-686963-8aa29e-3d5467-f1edee',
	'https://coolors.co/c6d8af-dbd8b3-fcc8b2-efa48b-685369',
];

colors.forEach((colorLink) => {
	const colorGuid = colorLink.split('/').pop() ?? '';
	const cols = colorGuid.split('-');
	console.log(cols);

	const hsls: hsl[] = cols.map((col) => {
		const rgb = parse(`#${col}`);
		return rgbToHsl(rgb);
	});

	drawHslWheel(hsls, `./output/${colorGuid}.png`);
});
