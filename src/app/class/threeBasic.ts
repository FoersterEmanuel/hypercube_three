import { BoxGeometry, BufferGeometry, ColorRepresentation, Line, LineBasicMaterial, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from "three";
import { ElementRef } from "@angular/core";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GeometicShapeObjectResult } from "./GeometricShape";
import UnitLine from "./UnitLine";


/* 
* @param 
*/
export default class ThreeBasic {

  private renderer = new WebGLRenderer();
  private scene = new Scene();
  // private camera = new PerspectiveCamera(75, 1, 0.1, 1000);
  private camera = new PerspectiveCamera(25, 1, 0.1, 1000);

  // OrbitControls for interactive camera control
  private orbitControls!: OrbitControls;

  // HTML container element where rendering takes place
  private containerRef!: HTMLDivElement;
  private size: { width: number, height: number } = { width: 0, height: 0 };

  constructor() {
    this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  // Sets the reference to the HTML container element
  public setContainerReference(containerRef: ElementRef<HTMLDivElement>): boolean {
    if (!containerRef || !containerRef.nativeElement) {
      console.error("Invalid container reference");
      return false;
    }

    this.containerRef = containerRef.nativeElement;
    this.containerRef.appendChild(this.renderer.domElement);

    this.setSize();
    this.camera.position.set(10, 5, 6);
    this.camera.lookAt(new Vector3(0, 0, 0));

    // Start the animation loop
    requestAnimationFrame(this.animate);

    return true;
  }

  // Adjusts the size of the rendering area to fit the container element
  public setSize(): void {
    this.size.width = this.containerRef.clientWidth;
    this.size.height = this.containerRef.clientHeight;

    this.renderer.setSize(this.size.width, this.size.height);
    this.camera.aspect = this.size.width / this.size.height;

    this.camera.updateProjectionMatrix();
  }

  // Adds a 3D object to the scene
  public addElement(element: GeometicShapeObjectResult) {
    this.scene.add(element);
  }
  // Remove a 3D object to the scene
  public removeElement(element: GeometicShapeObjectResult) {
    this.scene.remove(element);
  }

  // Adds a line between two points to the scene
  public addLine(unitLine: UnitLine, color?: ColorRepresentation) {
    const point_A = unitLine.point_A;
    const point_B = unitLine.point_B;

    const geometry = new BufferGeometry().setFromPoints([point_A.getVector3Stereographic(), point_B.getVector3Stereographic()]);
    const material = new LineBasicMaterial({ color });
    const line = new Line(geometry, material);
    this.scene.add(line);

    return line;
  }

  // Adds a test cube to the scene
  public addTestCube() {
    const boxGeometry = new BoxGeometry(1, 1, 1);
    const boxMaterial = new MeshBasicMaterial({ color: 0x00FF00, wireframe: true });
    const box = new Mesh(boxGeometry, boxMaterial);
    this.scene.add(box);
  }

  // Animation loop
  private animate = () => {
    this.orbitControls.update();
    this.render();

    // Continue the animation loop
    requestAnimationFrame(this.animate);
  }

  // Renders the 3D scene
  public render() {
    this.renderer.render(this.scene, this.camera);
  }
}