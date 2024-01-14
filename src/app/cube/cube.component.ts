import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from "three";

@Component({
  selector: 'app-cube',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cube.component.html',
  styleUrl: './cube.component.css'
})
export class CubeComponent implements AfterViewInit {

  @ViewChild('canvas') private canvasRef!: ElementRef;

  @Input() public rotationSpeedX: number = 0.002;
  @Input() public rotationSpeedY: number = 0.01;
  @Input() public size: number = 200;
  @Input() public texture: string = 'assets/textures/texture_blue&grey.jpg';

  @Input() public cameraZ: number = 500;
  @Input() public fieldOfView: number = 0.5;
  @Input('nearClipping') public nearClippingPlane: number = 1;
  @Input('farClipping') public farClippingPlane: number = 1000;

  private camera!: THREE.PerspectiveCamera;
  private loader = new THREE.TextureLoader();
  private geometry = new THREE.BoxGeometry(1, 1, 1);
  private material = new THREE.MeshPhongMaterial({ color: new THREE.Color('rgb(166,44,44)') });//new THREE.MeshBasicMaterial({map: this.loader.load(this.texture)});
  private cube: THREE.Mesh = new THREE.Mesh(this.geometry, this.material);
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;

  ngAfterViewInit(): void {
      this.createScene();
      this.startRenderingLoop();
  }

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  private createScene() {
    //scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('rgb(224, 224, 224)');
    this.scene.add(this.cube);
    //add light
    const light = new THREE.DirectionalLight(0xffffff, 6);
    light.position.set(0, 0, 100);
    this.scene.add(light);
    //camera
    let aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPlane,
      this.farClippingPlane
    );
    this.camera.position.z = 300;
    this.camera.position.y = 0;
    this.camera.rotateZ(0);
    this.camera.position.x = -0;
  }

  private getAspectRatio(): number {
    return this.canvas.clientHeight / this.canvas.clientHeight;
  }

  private animateCube(): void {
    this.cube.rotation.x += this.rotationSpeedX;
    this.cube.rotation.y += this.rotationSpeedY;
  }

  private startRenderingLoop(): void {
    this.renderer = new THREE.WebGLRenderer({canvas: this.canvas});
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    let component: CubeComponent = this;
    (function render(){
      requestAnimationFrame(render);
      component.animateCube();
      component.renderer.render(component.scene, component.camera);
    }());
  }
}
