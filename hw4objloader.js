function readModel(modelName, targetSize = 200) {

    var onProgress = function (xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };

    var onError = function (xhr) { };

    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('model/');
    mtlLoader.load( 'bus.mtl', function (materials) {

        materials.preload();

        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath('model/');
        objLoader.load('bus.obj', function (object) {

            theObject = unitize(object, targetSize);
            //theObject.add ( new THREE.BoxHelper (theObject) )
            theObject.name = 'OBJ'
            scene.add(theObject);

            theObject.setRotationFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0, 'ZYX'))
            theObject.position.y += 32;//*******
            theObject.position.x -= 200;
        }, onProgress, onError);

    });

}

////////////////////////////////////////
// wrap an Object3D around the given object
// so that it is centered at +Y axis
//
function unitize(object, targetSize) {

    // find bounding box of 'object'
    var box3 = new THREE.Box3();
    box3.setFromObject(object);
    var size = new THREE.Vector3();
    size.subVectors(box3.max, box3.min);//max-min = size
    var center = new THREE.Vector3();
    center.addVectors(box3.max, box3.min).multiplyScalar(0.5);

    // uniform scaling according to objSize
    var objSize = Math.max(size.x, size.y, size.z);
    var scaleSet = targetSize / objSize;

    var theObject = new THREE.Object3D();
    theObject.add(object);
    object.scale.set(scaleSet, scaleSet, scaleSet);
    object.position.set(-center.x * scaleSet, -center.y * scaleSet, -center.z * scaleSet);

    return theObject;

}