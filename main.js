import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import { GUI } from 'https://threejsfundamentals.org/threejs/../3rdparty/dat.gui.module.js';
import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';

var modal = document.getElementById("myModal");

// Get the image and insert it inside the modal - use its "alt" text as a caption
var img1 = document.getElementById("img1");
var img2 = document.getElementById("img2");
var img3 = document.getElementById("img3");
var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");
window.addEventListener('click', outsideClick);
img1.onclick = function () {
	modal.style.display = "block";
	modalImg.src = this.src;
	captionText.innerHTML = this.alt;
}
img2.onclick = function () {
	modal.style.display = "block";
	modalImg.src = this.src;
	captionText.innerHTML = this.alt;
}
img3.onclick = function () {
	modal.style.display = "block";
	modalImg.src = this.src;
	captionText.innerHTML = this.alt;
}

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
	modal.style.display = "none";
}

//close modal 
function outsideClick(e) {
	if (e.target == modal) {
		modal.style.display = "none";
	}
}
function main() {
	const canvas = document.querySelector('#c');
	const renderer = new THREE.WebGLRenderer({ alpha: true, canvas, antilias: true });
	const modelDiv = document.getElementById('model');
	modelDiv.appendChild(renderer.domElement);

	let mixer;
	const clock = new THREE.Clock();
	const fov = 80;
	const aspect = window.innerWidth / window.innerHeight;  // the canvas default
	const near = 1;
	const far = 2000;
	const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	camera.position.set(50, 200, 300);

	const controls = new OrbitControls(camera, canvas);
	controls.target.set(0, 109, 0);
	controls.update();

	const scene = new THREE.Scene();



	{

		const loader = new FBXLoader();
		loader.load('resources/img/Zombie.fbx', function (object) {
			mixer = new THREE.AnimationMixer(object);
			const action = mixer.clipAction(object.animations[0]);
			object.scale.multiplyScalar(1.4);
			action.play();
			scene.add(object);
		});

	}







	class ColorGUIHelper {
		constructor(object, prop) {
			this.object = object;
			this.prop = prop;
		}
		get value() {
			return `#${this.object[this.prop].getHexString()}`;
		}
		set value(hexString) {
			this.object[this.prop].set(hexString);
		}
	}

	{
		const color = 0xFFFFFF;
		const intensity = 5;
		const light = new THREE.AmbientLight(color, intensity);
		scene.add(light);

		/*const gui = new GUI();
		gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
		gui.add(light, 'intensity', 0, 2, 0.01);
		*/
	}

	function resizeRendererToDisplaySize(renderer) {
		const canvas = renderer.domElement;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const needResize = canvas.width !== width || canvas.height !== height;
		if (needResize) {
			renderer.setSize(width, height, false);
		}
		return needResize;
	}

	function render() {

		if (resizeRendererToDisplaySize(renderer)) {
			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();
		}

		renderer.render(scene, camera);

		requestAnimationFrame(render);
		const delta = clock.getDelta();
		if (mixer) mixer.update(delta);
	}

	requestAnimationFrame(render);
}

main();