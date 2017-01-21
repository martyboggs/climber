var world;
var fps = 0;
var f = [0,0,0];
var body = [];
self.onmessage = function (e) {

	if (e.data.oimoUrl && !world) {
		importScripts(e.data.oimoUrl);

		// Init physics
		OIMO.WORLD_SCALE = 1;
		OIMO.INV_SCALE = 1;
		world = new OIMO.World(e.data.dt, 2, 8, true);
		world.gravity.init(0, -10, 0);

		var lastBody;
		var platforms = e.data.platforms;
		for (var i = 0; i < platforms.length; i += 1) {
			var lastName = 'p' + i;
			new OIMO.Body({
				// type: 'box',
				size: [platforms[i].width, 1, platforms[i].depth],
				pos: [platforms[i].x, platforms[i].y, platforms[i].z],
				move: false,
				world: world,
				name: lastName
			});

			if (platforms[i].rope) {
				for (var j = 0; j < platforms[i].rope / 5; j += 1) {
					var bodyRope = new OIMO.Body({
						type: 'cylinder',
						size: [0.25, 4],
						pos: [platforms[i].x, platforms[i].y - 1 - 2.5 - 5 * j, platforms[i].z],
						move: true,
						world: world,
						name: 'p' + i + 'r' + j
					});

					// var pos1Y = pos1Y ? -2 : -0.5;
					// new OIMO.Link({
					// 	world: world,
					// 	type: 'jointDistance',
					// 	body1: lastName,
					// 	body2: bodyRope.name,
					// 	collision: true,
					// 	pos1: [0, pos1Y, 0],
					// 	pos2: [0, 2, 0],
					// 	axe1: [1, 0, 0],
					// 	axe2: [1, 0, 0],
					// 	min: 0.2,
					// 	max: 1,
					// 	limite: null,
					// 	spring: [8, 0.2],
					// 	motor: null,
					// 	name: 'joint'
					// });
					// lastName = bodyRope.name;
				}
			}
		}
	var first = true;
		var first = true;
	}

	// Step the world
	world.step();

	// Copy over the data to the buffers
	// var matrixs = e.data.matrixs;
	var minfo = e.data.minfo;
	var b = world.rigidBodies;
	var m, j, i=0, n;
	var pos, quad;
	while (b !== null) {
		if (b.sleeping) {
			minfo[n+7] = 1;
		} else {
if (first) console.log(b.name);
			minfo[n+7] = 0;
			n = 8*i;
			// get position
			pos = b.getPosition();
			minfo[n+0] = pos.x//.toFixed(3)*1;
			minfo[n+1] = pos.y//.toFixed(3)*1;
			minfo[n+2] = pos.z//.toFixed(3)*1;
			// get Quaternion
			quad = b.getQuaternion();
			//if(i==2)console.log(pos.x)
			minfo[n+3] = quad.x//.toFixed(3)*1;
			minfo[n+4] = quad.y//.toFixed(3)*1;
			minfo[n+5] = quad.z//.toFixed(3)*1;
			minfo[n+6] = quad.w//.toFixed(3)*1;
		}
		i++;
		b=b.next;
	}
// minfo has highest platforms at the beginning

	f[1] = Date.now();
	if (f[1]-1000>f[0]){ f[0]=f[1]; fps=f[2]; f[2]=0; } f[2]++;
	// Send data back to the main thread
	self.postMessage({ perf:fps, minfo:minfo }, [minfo.buffer]);
};
