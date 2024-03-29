var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.

var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var GLOBALS_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var ANIMATIONS_INDEX = 7;
var PRIMITIVES_INDEX = 8;
var COMPONENTS_INDEX = 9;

var GROUP_ORDER = ["scene", "views", "globals", "lights", "textures", "materials", "transformations", "primitives", "components"];

// Order of the material variables(element of materials group) in the XML document.

var EMISSION_INDEX = 0;
var AMBIENT_INDEX = 1;
var DIFFUSE_INDEX = 2;
var SPECULAR_INDEX = 3;


/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null;                    // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lxs")
            return "root tag <lxs> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var node of nodes)
            nodeNames.push(node.nodeName);

        var error;

        // Processes each node, verifying errors.

        // <scene>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order " + index);

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseView(nodes[index])) != null)
                return error;
        }

        // <ambient>
        if ((index = nodeNames.indexOf("globals")) == -1)
            return "tag <globals> missing";
        else {
            if (index != GLOBALS_INDEX)
                this.onXMLMinorError("tag <globals> out of order");

            //Parse ambient block
            if ((error = this.parseGlobals(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        if ((index = nodeNames.indexOf("animations")) == -1)
            return "tag <animations> missing";
        else {
            if (index != ANIMATIONS_INDEX)
                this.onXMLMinorError("tag <animations> out of order");

            // Parse animations block
            if ((error = this.parseAnimations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
        this.log("all parsed");
    }

    /**
     * Parses the <scene> block. 
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {

        // Get root of the scene.
        var root = this.reader.getString(sceneNode, 'root')
        if (root == null)
            return "no root defined for scene";

        this.idRoot = root;

        // Get axis length        
        var axis_length = this.reader.getFloat(sceneNode, 'axis_length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed scene");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseView(viewsNode) {
        // check if there is a default value defined for the view
        this.defaultCameraId = this.reader.getString(viewsNode, 'default');

        if (this.defaultCameraId == null)
            return "no default view is defined";

        var children = viewsNode.children;
        this.cameras = [];

        if (children.length == 0)
            return "at least one view must be defined";

        for (var child of children) {

            if (child.nodeName == 'perspective')
                this.parsePerspectiveView(child);

            else if (child.nodeName == 'ortho')
                this.parseOrthoView(child);

            else
                this.onXMLMinorError("unknown tag <" + child.nodeName + ">");
        }

        if (this.cameras[this.defaultCameraId] == null)
            return "a view with a default id is not defined";

        return null;
    }

    /**
     * Parses a perspective view node (into a camera and adds it to the camera array of the scene graph)
     * @param {lxs perspective view node} child 
     */
    parsePerspectiveView(child) {
        // Get id of the current perspective
        var viewId = this.reader.getString(child, 'id');
        if (viewId == null)
            return "no ID defined for perspective";

        // Checks for repeated IDs.
        if (this.cameras[viewId] != null)
            return "ID must be unique for each view (conflict: ID = " + viewId + ")";

        // Get near clipping plane
        var viewNear = this.reader.getFloat(child, 'near');
        if (viewNear == null || isNaN(viewNear))
            return "no near clipping plane distance defined";

        // Get far clipping plane
        var viewFar = this.reader.getFloat(child, 'far');
        if (viewFar == null || isNaN(viewFar))
            return "no far clipping plane distance defined";

        // Get angle
        var viewAngle = this.reader.getFloat(child, 'angle');
        if (viewAngle == null || isNaN(viewAngle))
            return "no field of view angle defined";

        // Validate to and from nodes
        var fromValues, toValues;
        var fromFlag = false, toFlag = false;
        for (var grandChild of child.children) {
            if (grandChild.nodeName == 'from') {
                var x = this.reader.getFloat(grandChild, 'x');
                if (x == null || isNaN(x))
                    return "no x component for from defined";

                var y = this.reader.getFloat(grandChild, 'y');
                if (y == null || isNaN(y))
                    return "no y component for from defined";

                var z = this.reader.getFloat(grandChild, 'z');
                if (z == null || isNaN(z))
                    return "no z component for from defined";

                fromValues = vec3.fromValues(x, y, z);
                fromFlag = true;
            }
            else if (grandChild.nodeName == 'to') {
                var x = this.reader.getFloat(grandChild, 'x');
                if (x == null || isNaN(x))
                    return "no x component for to defined";

                var y = this.reader.getFloat(grandChild, 'y');
                if (y == null || isNaN(y))
                    return "no y component for to defined";

                var z = this.reader.getFloat(grandChild, 'z');
                if (z == null || isNaN(z))
                    return "no z component for to defined";

                toValues = vec3.fromValues(x, y, z);
                toFlag = true;
            }
            else {
                this.onXMLMinorError("unknown tag <" + child.nodeName + ">");
            }
        }

        if (!toFlag) {
            return "to not defined";
        }
        else if (!fromFlag) {
            return "from not defined";
        }

        var view = new CGFcamera(viewAngle * DEGREE_TO_RAD, viewNear, viewFar, fromValues, toValues);
        this.cameras[viewId] = view;
    }

    /**
    * Parses a orthographic view node (into a camera and adds it to the camera array of the scene graph)
    * @param {lxs orthographic view node} child 
    */
    parseOrthoView(child) {
        // Get id of the current ortho
        var viewId = this.reader.getString(child, 'id');
        if (viewId == null)
            return "no ID defined for ortho";

        // Checks for repeated IDs.
        if (this.cameras[viewId] != null)
            return "ID must be unique for each view (conflict: ID = " + viewId + ")";

        // Get near clipping plane
        var viewNear = this.reader.getFloat(child, 'near');
        if (viewNear == null || isNaN(viewNear))
            return "no near clipping plane distance defined";

        // Get far clipping plane
        var viewFar = this.reader.getFloat(child, 'far');
        if (viewFar == null || isNaN(viewFar))
            return "no far clipping plane distance defined";

        // Get left bound of the frustum
        var viewLeft = this.reader.getFloat(child, 'left');
        if (viewLeft == null || isNaN(viewLeft))
            return "no left bound for the frustum defined";

        // Get right bound of the frustum
        var viewRight = this.reader.getFloat(child, 'right');
        if (viewRight == null || isNaN(viewRight))
            return "no right bound for the frustum defined";

        // Get top bound of the frustum
        var viewTop = this.reader.getFloat(child, 'top');
        if (viewTop == null || isNaN(viewTop))
            return "no top bound for the frustum defined";

        // Get bottom bound of the frustum
        var viewBottom = this.reader.getFloat(child, 'bottom');
        if (viewBottom == null || isNaN(viewBottom))
            return "no bottom bound for the frustum defined";

        // Validate to and from nodes
        var fromValues, toValues, upValues = vec3.fromValues(0, 1, 0);
        var fromFlag = false, toFlag = false;
        for (var grandChild of child.children) {
            if (grandChild.nodeName == 'from') {
                var x = this.reader.getFloat(grandChild, 'x');
                if (x == null || isNaN(x))
                    return "no x component for from defined";

                var y = this.reader.getFloat(grandChild, 'y');
                if (y == null || isNaN(y))
                    return "no y component for from defined";

                var z = this.reader.getFloat(grandChild, 'z');
                if (z == null || isNaN(z))
                    return "no z component for from defined";

                fromValues = vec3.fromValues(x, y, z);
                fromFlag = true;
            }
            else if (grandChild.nodeName == 'to') {
                var x = this.reader.getFloat(grandChild, 'x');
                if (x == null || isNaN(x))
                    return "no x component for to defined";

                var y = this.reader.getFloat(grandChild, 'y');
                if (y == null || isNaN(y))
                    return "no y component for to defined";

                var z = this.reader.getFloat(grandChild, 'z');
                if (z == null || isNaN(z))
                    return "no z component for to defined";

                toValues = vec3.fromValues(x, y, z);
                toFlag = true;
            }
            else if (grandChild.nodeName == 'up') {
                var x = this.reader.getFloat(grandChild, 'x');
                if (x == null || isNaN(x))
                    return "no x component for up defined";

                var y = this.reader.getFloat(grandChild, 'y');
                if (y == null || isNaN(y))
                    return "no y component for up defined";

                var z = this.reader.getFloat(grandChild, 'z');
                if (z == null || isNaN(z))
                    return "no z component for up defined";

                upValues = vec3.fromValues(x, y, z);
            }
            else {
                this.onXMLMinorError("unknown tag <" + child.nodeName + ">");
            }
        }

        if (!toFlag) {
            return "to not defined";
        }
        else if (!fromFlag) {
            return "from not defined";
        }

        var view = new CGFcameraOrtho(viewLeft, viewRight, viewBottom, viewTop, viewNear, viewFar, fromValues, toValues, upValues);
        this.cameras[viewId] = view;
    }

    /**
     * Parses the <ambient> node.
     * @param {ambient block element} ambientsNode
     */
    parseGlobals(ambientsNode) {

        var children = ambientsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed ambient");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "omni" && children[i].nodeName != "spot") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["location", "ambient", "diffuse", "specular", "attenuation"]);
                attributeTypes.push(...["position", "color", "color", "color", "attenuation"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            // Light enable/disable
            var enableLight = true;
            var aux = this.reader.getBoolean(children[i], 'enabled');
            if (!(aux != null && !isNaN(aux) && (aux == true || aux == false)))
                this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");

            // FIXME: this line was made by the teachers, but it results in a light not being able to be disabled from the get go
            // enableLight = aux || 1;
            enableLight = aux;

            //Add enabled boolean and type name to light info
            global.push(enableLight);
            global.push(children[i].nodeName);

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else if (attributeTypes[j] == "color")
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);
                    else if (attributeTypes[j] == "attenuation")
                        var aux = this.parseAttenuation(grandChildren[attributeIndex], attributeNames[j] + " attenuation for ID" + lightId);

                    if (!Array.isArray(aux))
                        return aux;
                    else
                        global.push(aux);
                }
                else
                    return "light " + attributeNames[j] + " undefined for ID = " + lightId;
            }

            // Gets the additional attributes of the spot light
            if (children[i].nodeName == "spot") {
                var angle = this.reader.getFloat(children[i], 'angle');
                if (!(angle != null && !isNaN(angle)))
                    return "unable to parse angle of the light for ID = " + lightId;

                var exponent = this.reader.getFloat(children[i], 'exponent');
                if (!(exponent != null && !isNaN(exponent)))
                    return "unable to parse exponent of the light for ID = " + lightId;

                var targetIndex = nodeNames.indexOf("target");

                // Retrieves the light target.
                var targetLight = [];
                if (targetIndex != -1) {
                    var aux = this.parseCoordinates3D(grandChildren[targetIndex], "target light for ID " + lightId);
                    if (!Array.isArray(aux))
                        return aux;

                    targetLight = aux;
                }
                else
                    return "light target undefined for ID = " + lightId;

                global.push(...[angle, exponent, targetLight]);
            }

            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {

        var children = texturesNode.children;
        this.textures = [];

        if (children.length == 0)
            return "there must be at least on texture declared";

        for (var i = 0; i < children.length; i++) {

            // Get id of the current texture.
            var textureID = this.reader.getString(children[i], 'id');
            if (textureID == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.textures[textureID] != null)
                return "ID must be uni  que for each texture (conflict: ID = " + textureID + ")";

            var textureSrcPath = this.reader.getString(children[i], 'file');

            // Check for valid extension
            var fileExtension = getExtension(textureSrcPath)
            if (fileExtension != "png" && fileExtension != "jpg" && fileExtension != "jpeg")
                return "Invalid extension for texture source file (conflict: ID = " + textureID + ")";

            this.textures[textureID] = new CGFtexture(this.scene, textureSrcPath);
        }


        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {

        this.materials = [];

        var children = materialsNode.children;
        var grandChildren = [];
        var index;

        if (children.length == 0)
            return "there must be at least on material declared";

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each light (conflict: ID = " + materialID + ")";


            // Get shininess value.
            var shininessValue = this.reader.getFloat(children[i], 'shininess');
            if (shininessValue == null)
                return "no shininess defined for material with ID = " + materialID;

            grandChildren = children[i].children;

            // Reads the names of the material parameters to an auxiliary buffer.
            var grandChildrenNames = [];

            for (var j = 0; j < grandChildren.length; j++)
                grandChildrenNames.push(grandChildren[j].nodeName);

            if ((index = grandChildrenNames.indexOf("emission")) == -1)
                return "tag <emission (...)> missing";
            else {

                if (index != EMISSION_INDEX)
                    this.onXMLMinorError("tag <emission (...)> out of order");

                var childEmission = this.parseColor(grandChildren[index], 'emission');

                if (!Array.isArray(childEmission))
                    return childEmission;
            }

            if ((index = grandChildrenNames.indexOf("ambient")) == -1)
                return "tag <ambient (...)> missing";
            else {

                if (index != AMBIENT_INDEX)
                    this.onXMLMinorError("tag <ambient (...)> out of order");

                var childAmbient = this.parseColor(grandChildren[index], 'ambient');

                if (!Array.isArray(childAmbient))
                    return childAmbient;
            }

            if ((index = grandChildrenNames.indexOf("diffuse")) == -1)
                return "tag <diffuse (...)> missing";
            else {

                if (index != DIFFUSE_INDEX)
                    this.onXMLMinorError("tag <diffuse (...)> out of order");

                var childDiffuse = this.parseColor(grandChildren[index], 'diffuse');

                if (!Array.isArray(childDiffuse))
                    return childDiffuse;
            }

            if ((index = grandChildrenNames.indexOf("specular")) == -1)
                return "tag <specular (...)> missing";
            else {

                if (index != SPECULAR_INDEX)
                    this.onXMLMinorError("tag <specular (...)> out of order");

                var childSpecular = this.parseColor(grandChildren[index], 'specular');

                if (!Array.isArray(childSpecular))
                    return childSpecular;
            }

            this.materials[materialID] = new CGFappearance(this.scene);
            this.materials[materialID].setAmbient(...childAmbient);
            this.materials[materialID].setDiffuse(...childDiffuse);
            this.materials[materialID].setSpecular(...childSpecular);
            this.materials[materialID].setEmission(...childEmission);
            this.materials[materialID].setShininess(shininessValue);
        }

        this.log("Parsed materials");
        return null;
    }

    /**
     * Parses a single transformation node. Receives the id of the transformation and the matrix where the transformation must be applied.
     * @param {lxs transformation node} transformationNode 
     * @param {String} transformationID 
     * @param {mat4} transfMatrix 
     */
    parseTransformationNode(transformationNode, transformationID, transfMatrix) {

        var grandChildren = transformationNode.children;

        // Specifications for the current transformation.
        for (var j = 0; j < grandChildren.length; j++) {
            switch (grandChildren[j].nodeName) {

                case 'translate':
                    var coordinates = this.parseCoordinates3D(grandChildren[j], "translate transformation for ID " + transformationID);
                    if (!Array.isArray(coordinates))
                        return coordinates;

                    transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
                    break;
                case 'scale':
                    var scaleFactors = this.parseCoordinates3D(grandChildren[j], "scale transformation for ID " + transformationID);
                    if (!Array.isArray(scaleFactors))
                        return scaleFactors;

                    transfMatrix = mat4.scale(transfMatrix, transfMatrix, scaleFactors);
                    break;
                case 'rotate':

                    var angleDeg = this.reader.getFloat(grandChildren[j], 'angle');

                    if (angleDeg == null)
                        return "no angle defined for rotation in transformation with ID=" + transformationID;

                    var angleRad = angleDeg * DEGREE_TO_RAD;
                    var axis = this.reader.getString(grandChildren[j], 'axis');

                    if (axis == null)
                        return "no axis of rotation defined for rotation in transformation with ID=" + transformationID;

                    switch (axis) {

                        case 'x':

                            transfMatrix = mat4.rotateX(transfMatrix, transfMatrix, angleRad);
                            break;

                        case 'y':

                            transfMatrix = mat4.rotateY(transfMatrix, transfMatrix, angleRad);
                            break;

                        case 'z':

                            transfMatrix = mat4.rotateZ(transfMatrix, transfMatrix, angleRad);
                            break;

                        default:

                            return "invalid rotation axis for rotation in transformation with ID=" + transformationID;

                    }

                    break;
            }
        }

        return null;
    }

    /**
     * Parses the <transformations> block.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {

        var children = transformationsNode.children;
        this.transformations = [];

        // Any number of transformations.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "transformation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current transformation.
            var transformationID = this.reader.getString(children[i], 'id');
            if (transformationID == null)
                return "no ID defined for transformation";

            // Checks for repeated IDs.
            if (this.transformations[transformationID] != null)
                return "ID must be unique for each transformation (conflict: ID = " + transformationID + ")";


            var transfMatrix = mat4.create();
            var transformationParse = this.parseTransformationNode(children[i], transformationID, transfMatrix);

            if (transformationParse != null)
                return transformationParse;

            this.transformations[transformationID] = transfMatrix;
        }

        this.log("Parsed transformations");
        return null;
    }

    
    /**
     * Parse a keyframe
     * @param {keyframe node} keyframeNode 
     * @param {Number} animationID 
     */
    parseKeyFrame(keyframeNode, animationID) {

        var children = keyframeNode.children;

        // Default values for the transformations
        let scaling, rotation, translation;

        var instant = this.reader.getFloat(keyframeNode, 'instant');
        if (instant == null)
            return "no instant defined for keyframe in animation with ID=" + animationID;
        
        for (var i = 0; i < children.length; i++) {
            switch (children[i].nodeName) {

                case 'translate':
                    if (i != 0)
                        this.onXMLMinorError("tag <translate> out of order in keyframe(" + instant + ") in animation with ID=" + animationID);

                    var coordinates = this.parseCoordinates3D(children[i], "animation translation");
                    if (!Array.isArray(coordinates))
                        return coordinates;

                    translation = coordinates;
                    break;

                case 'rotate':
                    if (i != 1)
                        this.onXMLMinorError("tag <rotate> out of order in keyframe(" + instant + ") in animation with ID=" + animationID);

                    var angleXDeg = this.reader.getFloat(children[i], 'angle_x');
                    var angleYDeg = this.reader.getFloat(children[i], 'angle_y');
                    var angleZDeg = this.reader.getFloat(children[i], 'angle_z');
        
                    // Convert to radians
                    var angleXRad = angleXDeg * DEGREE_TO_RAD;
                    var angleYRad = angleYDeg * DEGREE_TO_RAD;
                    var angleZRad = angleZDeg * DEGREE_TO_RAD;
        
                    rotation = [angleXRad, angleYRad, angleZRad];
                    break;

                case 'scale':
                    if (i != 2)
                        this.onXMLMinorError("tag <scale> out of order in keyframe(" + instant + ") in animation with ID=" + animationID);

                    var coordinates = this.parseCoordinates3D(children[i], "animation scale");
                    if (!Array.isArray(coordinates))
                        return coordinates;

                    scaling = coordinates;
                    break;
            }
        }

        if (children.length < 3) {
            
            if (scaling == undefined) {
                scaling = [1, 1, 1];
                this.onXMLMinorError("tag <scale> is not defined in keyframe(" + instant + ") in animation with ID=" + animationID);
            }

            if (rotation == undefined) {
                rotation = [0, 0, 0];
                this.onXMLMinorError("tag <rotation> is not defined in keyframe(" + instant + ") in animation with ID=" + animationID);
            }

            if (translation == undefined) {
                translation = [0, 0, 0];
                this.onXMLMinorError("tag <translation> is not defined in keyframe(" + instant + ") in animation with ID=" + animationID);

            }
        }

        return new KeyFrame(instant, translation, rotation, scaling);
    }

    /**
     * Parses an <animation> node. Returns a Keyframe animation
     * @param {animation node element} animationNode
     */
    parseAnimationNode(animationNode, animationID) {

        let children = animationNode.children;
        let keyframes = [];

        // Specifications for the current animation.
        let time = 0;
        for (let i = 0; i < children.length; i++) {
            if (children[i].nodeName == 'keyframe') {

                // Get every keyframe
                let keyframe = this.parseKeyFrame(children[i], animationID);
                if (typeof keyframe == 'string')
                    return keyframe;
                
                // A keyframes instant should be greater than the instant of the previous keyframe
                if (time >= keyframe.time) {
                    return "invalid time of keyframe(" + keyframe.time + ") in animation with ID=" + animationID;
                }
                    
                time = keyframe.time;

                keyframes.push(keyframe);
            }
            else {
                return "unknown child-tag in animation with ID=" + animationID;
            }
        }
        return new KeyFrameAnimation(this.scene, animationID, keyframes);
    }

    /**
     * Method to parse the <animations> block
     * @param {lxs animations node} animationsNode 
     */
    parseAnimations(animationsNode) {

        var children = animationsNode.children;
        this.animations = [];

        // Any number of animations.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "animation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current animation.
            var animationID = this.reader.getString(children[i], 'id');
            if (animationID == null)
                return "no ID defined for animation";

            // Checks for repeated IDs.
            if (this.animations[animationID] != null)
                return "ID must be unique for each animation (conflict: ID = " + animationID + ")";

            var animation = this.parseAnimationNode(children[i], animationID);
            if (typeof animation == 'string')
                return animation;
            this.animations[animationID] = animation;
        }


        this.log("Parsed animations");
        return null;
    }

    /**
     * Method to parse a lxs-format rectangle node
     * @param {String} primitiveId 
     * @param {lxs rectangle node} rectangleNode 
     */
    parseRectangle(primitiveId, rectangleNode) {

        // x1
        var x1 = this.reader.getFloat(rectangleNode, 'x1');
        if (!(x1 != null && !isNaN(x1)))
            return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

        // y1
        var y1 = this.reader.getFloat(rectangleNode, 'y1');
        if (!(y1 != null && !isNaN(y1)))
            return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

        // x2
        var x2 = this.reader.getFloat(rectangleNode, 'x2');
        if (!(x2 != null && !isNaN(x2)))
            return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

        // y2
        var y2 = this.reader.getFloat(rectangleNode, 'y2');
        if (!(y2 != null && !isNaN(y2)))
            return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

        return new MyRectangle(this.scene, primitiveId, x1, x2, y1, y2);

    }

    /**
     * Method to parse a lxs-format cylinder node
     * @param {String} primitiveId 
     * @param {lxs cylinder node} cylinderNode 
     */
    parseCylinder(primitiveId, cylinderNode) {

        var base = this.reader.getFloat(cylinderNode, 'base');
        if (!(base != null && !isNaN(base)))
            return "unable to parse base of the primitive coordinates for ID = " + primitiveId;

        var top = this.reader.getFloat(cylinderNode, 'top');
        if (!(top != null && !isNaN(top)))
            return "unable to parse top of the primitive coordinates for ID = " + primitiveId;

        var height = this.reader.getFloat(cylinderNode, 'height');
        if (!(height != null && !isNaN(height)))
            return "unable to parse height of the primitive coordinates for ID = " + primitiveId;

        var slices = this.reader.getFloat(cylinderNode, 'slices');
        if (!(slices != null && !isNaN(slices)))
            return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

        var stacks = this.reader.getFloat(cylinderNode, 'stacks');
        if (!(stacks != null && !isNaN(stacks)))
            return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;


        return new MyCylinder(this.scene, base, top, height, slices, stacks);
    }

    parseCylinder2(primitiveId, cylinderNode) {

        var base = this.reader.getFloat(cylinderNode, 'base');
        if (!(base != null && !isNaN(base)))
            return "unable to parse base of the primitive coordinates for ID = " + primitiveId;

        var top = this.reader.getFloat(cylinderNode, 'top');
        if (!(top != null && !isNaN(top)))
            return "unable to parse top of the primitive coordinates for ID = " + primitiveId;

        var height = this.reader.getFloat(cylinderNode, 'height');
        if (!(height != null && !isNaN(height)))
            return "unable to parse height of the primitive coordinates for ID = " + primitiveId;

        var slices = this.reader.getFloat(cylinderNode, 'slices');
        if (!(slices != null && !isNaN(slices)))
            return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

        var stacks = this.reader.getFloat(cylinderNode, 'stacks');
        if (!(stacks != null && !isNaN(stacks)))
            return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;


        return new MyCylinder2(this.scene, base, top, height, slices, stacks);
    }

    /**
     * Method use to parse a lxs-format triangle node
     * @param {String} primitiveId 
     * @param {lxs triangle node} triangleNode 
     */
    parseTriangle(primitiveId, triangleNode) {

        // x1
        var x1 = this.reader.getFloat(triangleNode, 'x1');
        if (!(x1 != null && !isNaN(x1)))
            return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

        // y1
        var y1 = this.reader.getFloat(triangleNode, 'y1');
        if (!(y1 != null && !isNaN(y1)))
            return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

        // z1
        var z1 = this.reader.getFloat(triangleNode, 'z1');
        if (!(z1 != null && !isNaN(z1)))
            return "unable to parse z1 of the primitive coordinates for ID = " + primitiveId;

        // x2
        var x2 = this.reader.getFloat(triangleNode, 'x2');
        if (!(x2 != null && !isNaN(x2)))
            return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

        // y2
        var y2 = this.reader.getFloat(triangleNode, 'y2');
        if (!(y2 != null && !isNaN(y2)))
            return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

        // z2
        var z2 = this.reader.getFloat(triangleNode, 'z2');
        if (!(z2 != null && !isNaN(z2)))
            return "unable to parse z2 of the primitive coordinates for ID = " + primitiveId;

        // x3
        var x3 = this.reader.getFloat(triangleNode, 'x3');
        if (!(x3 != null && !isNaN(x3)))
            return "unable to parse x3 of the primitive coordinates for ID = " + primitiveId;

        // y2
        var y3 = this.reader.getFloat(triangleNode, 'y3');
        if (!(y3 != null && !isNaN(y3)))
            return "unable to parse y3 of the primitive coordinates for ID = " + primitiveId;

        // z3
        var z3 = this.reader.getFloat(triangleNode, 'z3');
        if (!(z3 != null && !isNaN(z3)))
            return "unable to parse z3 of the primitive coordinates for ID = " + primitiveId;

        return new MyTriangle(this.scene, [x1, y1, z1], [x2, y2, z2], [x3, y3, z3]);
    }

    /**
     * Method use to parse a lxs-format sphere node
     * @param {String} primitiveId 
     * @param {lxs sphere node} sphereNode 
     */
    parseSphere(primitiveId, sphereNode) {

        var radius = this.reader.getFloat(sphereNode, 'radius');
        if (!(radius != null && !isNaN(radius)))
            return "unable to parse radius of the primitive coordinates for ID = " + primitiveId;

        var slices = this.reader.getFloat(sphereNode, 'slices');
        if (!(slices != null && !isNaN(slices)))
            return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

        var stacks = this.reader.getFloat(sphereNode, 'stacks');
        if (!(stacks != null && !isNaN(stacks)))
            return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;


        return new MySphere(this.scene, radius, slices, stacks);
    }

    /**
     * Method use to parse a lxs-format torus node
     * @param {String} primitiveId 
     * @param {lxs torus node} torusNode 
     */
    parseTorus(primitiveId, torusNode) {

        var inner = this.reader.getFloat(torusNode, 'inner');
        if (!(inner != null && !isNaN(inner)))
            return "unable to parse inner of the primitive coordinates for ID = " + primitiveId;

        var outer = this.reader.getFloat(torusNode, 'outer');
        if (!(outer != null && !isNaN(outer)))
            return "unable to parse outer of the primitive coordinates for ID = " + primitiveId;

        var slices = this.reader.getFloat(torusNode, 'slices');
        if (!(slices != null && !isNaN(slices)))
            return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

        var loops = this.reader.getFloat(torusNode, 'loops');
        if (!(loops != null && !isNaN(loops)))
            return "unable to parse loops of the primitive coordinates for ID = " + primitiveId;

        return new MyTorus(this.scene, outer, inner, slices, loops);
    }

    /**
     * Method to parse a lxs-format plane node
     * @param {String} primitiveId 
     * @param {lxs plane node} planeNode 
     */
    parsePlane(primitiveId, planeNode) {

        // npartsU
        var npartsU = this.reader.getInteger(planeNode, 'npartsU');
        if (!(npartsU != null && !isNaN(npartsU)))
            return "unable to parse npartsU of the primitive parameters for ID = " + primitiveId;

        // npartsV
        var npartsV = this.reader.getInteger(planeNode, 'npartsV');
        if (!(npartsV != null && !isNaN(npartsV)))
            return "unable to parse npartsV of the primitive parameters for ID = " + primitiveId;


        return new MyPlane(this.scene, npartsU, npartsV);

    }

    /**
    * Method to parse a lxs-format patch node
    * @param {String} primitiveId 
    * @param {lxs patch node} patchNode 
    */
    parsePatch(primitiveId, patchNode) {

        // npartsU
        var npartsU = this.reader.getInteger(patchNode, 'npartsU');
        if (!(npartsU != null && !isNaN(npartsU)))
            return "unable to parse npartsU of the primitive parameters for ID = " + primitiveId;

        // npartsV
        var npartsV = this.reader.getInteger(patchNode, 'npartsV');
        if (!(npartsV != null && !isNaN(npartsV)))
            return "unable to parse npartsV of the primitive parameters for ID = " + primitiveId;

        // npointsU
        var npointsU = this.reader.getInteger(patchNode, 'npointsU');
        if (!(npointsU != null && !isNaN(npointsU)))
            return "unable to parse npointsU of the primitive parameters for ID = " + primitiveId;

        // npointsV
        var npointsV = this.reader.getInteger(patchNode, 'npointsV');
        if (!(npointsV != null && !isNaN(npointsV)))
            return "unable to parse npointsV of the primitive parameters for ID = " + primitiveId;

        let children = patchNode.children;
        let upoints = [];

        // get control points

        for(let u = 0; u < npointsU; u++){

            let vpoints = [];

            for(let v = 0; v < npointsV; v++){

                let index = u * npointsV + v; 

                if(children[index].nodeName != 'controlpoint')
                    return "unknown tag <" + children[index].nodeName + "> for primtive with ID =  " + primitiveId;

                var xx = this.reader.getFloat(children[index], 'xx');
                var yy = this.reader.getFloat(children[index], 'yy');
                var zz = this.reader.getFloat(children[index], 'zz');

                vpoints.push([xx,yy,zz,1]);
            }

            upoints.push(vpoints);
        }
        return new MyPatch(this.scene,npartsU,npartsV,npointsU - 1,npointsV - 1,upoints);

    }

    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {

        var children = primitivesNode.children;
        this.primitives = [];
        var grandChildren = [];

        // Any number of primitives.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "primitive") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current primitive.
            var primitiveId = this.reader.getString(children[i], 'id');
            if (primitiveId == null)
                return "no ID defined for primitive";

            // Checks for repeated IDs.
            if (this.primitives[primitiveId] != null)
                return "ID must be unique for each primitive (conflict: ID = " + primitiveId + ")";

            grandChildren = children[i].children;

            // Validate the primitive type
            if (grandChildren.length != 1 ||
                (grandChildren[0].nodeName != 'rectangle'
                    && grandChildren[0].nodeName != 'triangle'
                    && grandChildren[0].nodeName != 'cylinder'
                    && grandChildren[0].nodeName != 'cylinder2'
                    && grandChildren[0].nodeName != 'sphere'
                    && grandChildren[0].nodeName != 'plane'
                    && grandChildren[0].nodeName != 'patch'
                    && grandChildren[0].nodeName != 'torus')) {
                return "There must be exactly 1 primitive type (rectangle, triangle, cylinder, cylinder2, plane, patch, sphere or torus)"
            }

            // Specifications for the current primitive.
            var primitiveType = grandChildren[0].nodeName;

            // Retrieves the primitive coordinates.
            if (primitiveType == 'rectangle') {

                var rectangle = this.parseRectangle(primitiveId, grandChildren[0]);

                if (typeof rectangle === 'string' || rectangle instanceof String)
                    return rectangle;

                this.primitives[primitiveId] = rectangle;
            }
            else if (primitiveType == 'cylinder') {

                var cylinder = this.parseCylinder(primitiveId, grandChildren[0]);

                if (typeof cylinder === 'string' || cylinder instanceof String)
                    return cylinder;

                this.primitives[primitiveId] = cylinder;

            }
            else if (primitiveType == 'cylinder2') {

                var cylinder2 = this.parseCylinder2(primitiveId, grandChildren[0]);

                if (typeof cylinder2 === 'string' || cylinder2 instanceof String)
                    return cylinder2;

                this.primitives[primitiveId] = cylinder2;

            }
            else if (primitiveType == 'triangle') {

                var triangle = this.parseTriangle(primitiveId, grandChildren[0]);

                if (typeof triangle === 'string' || triangle instanceof String)
                    return triangle;

                this.primitives[primitiveId] = triangle;
            }
            else if (primitiveType == 'sphere') {

                var sphere = this.parseSphere(primitiveId, grandChildren[0]);

                if (typeof sphere === 'string' || sphere instanceof String)
                    return sphere;

                this.primitives[primitiveId] = sphere;
            }
            else if (primitiveType == 'torus') {

                var torus = this.parseTorus(primitiveId, grandChildren[0]);

                if (typeof torus === 'string' || torus instanceof String)
                    return torus;

                this.primitives[primitiveId] = torus;
            }
            else if (primitiveType == 'plane') {
                var plane = this.parsePlane(primitiveId, grandChildren[0]);

                if (typeof plane === 'string' || plane instanceof String)
                    return plane;

                this.primitives[primitiveId] = plane;

            }
            else if (primitiveType == 'patch') {
                var patch = this.parsePatch(primitiveId, grandChildren[0]);

                if (typeof patch === 'string' || patch instanceof String)
                    return patch;

                this.primitives[primitiveId] = patch;

            }
        }

        this.log("Parsed primitives");
        return null;
    }

    /**
     * Parse the transformations section of a component
     * @param {MySceneComponent} currentComponent          
     * @param {Number} componentID 
     * @param {lxs transformation node} transformationNode 
     */
    parseComponentTransformations(currentComponent, componentID, transformationNode) {
        var nodeNames = [];
        for (var j = 0; j < transformationNode.children.length; j++) {
            nodeNames.push(transformationNode.children[j].nodeName);
        }

        var transformationRefIndex = nodeNames.indexOf("transformationref");

        if (transformationRefIndex != -1) {

            var transformationrefID = this.reader.getString(transformationNode.children[transformationRefIndex], 'id');
            if (this.transformations[transformationrefID] == null)
                return "given transformation does not exist (component with ID=" + componentID + ")";

            currentComponent.transformation = this.transformations[transformationrefID];

        } else {

            var transfMatrix = mat4.create();
            var transformationParse = this.parseTransformationNode(transformationNode, "[component]" + componentID, transfMatrix);
            if (transformationParse != null)
                return transformationParse;

            currentComponent.transformation = transfMatrix;
        }

        return null
    }

    /**
     * Parse the materials section of a component
     * @param {MySceneComponent} currentComponent          
     * @param {Number} componentID 
     * @param {lxs materials node} materialsNode 
     */
    parseComponentMaterials(currentComponent, componentID, materialsNode) {
        if (materialsNode.children.length == 0)
            return "there must be at least one material declared";

        for (var j = 0; j < materialsNode.children.length; j++) {

            if (materialsNode.children[j].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[j].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var materialID = this.reader.getString(materialsNode.children[j], 'id');
            if (materialID == null)
                return "no ID defined for material";

            if (materialID == 'inherit') {

                currentComponent.materials.push('inherit');
                continue;
            }

            // Checks for repeated IDs.
            if (this.materials[materialID] == null)
                return "there is no material with ID = " + materialID + "(conflict in component with ID=" + componentID + ")";

            currentComponent.materials.push(this.materials[materialID]);

        }
        return null;
    }

    /**
     * Parse the texture section of a component
     * @param {MySceneComponent} currentComponent          
     * @param {Number} componentID 
     * @param {lxs texture node} textureNode 
     */
    parseComponentTexture(currentComponent, componentID, textureNode) {

        //get ID of current texture
        var textureID = this.reader.getString(textureNode, 'id');

        if ((textureID == 'inherit') || (textureID == 'none')) {

            currentComponent.textureBehaviour = textureID;

        }
        else if (this.textures[textureID] == null)
            return "there is no texture with ID = " + textureID + "(conflict in component with ID=" + componentID + ")";
        else {

            currentComponent.texture = this.textures[textureID];
            var lengthS = this.reader.getFloat(textureNode, 'length_s');
            var lengthT = this.reader.getFloat(textureNode, 'length_t');

            if (lengthS == null)
                return "lengthS not provided for texture in component with ID=" + componentID;

            if (lengthT == null)
                return "lengthT not provided for texture in component with ID=" + componentID;

            currentComponent.textureLengthS = lengthS;
            currentComponent.textureLengthT = lengthT;
        }
        return null;
    }

    /**
     * Parse the children section of a component
     * @param {MySceneComponent} currentComponent          
     * @param {Number} componentID 
     * @param {lxs component children node} childrenNode 
     */
    parseComponentChildren(currentComponent, componentID, childrenNode) {

        if (childrenNode.children.length == 0)
            return "there must be at least one child declared";

        for (var j = 0; j < childrenNode.children.length; j++) {

            if (childrenNode.children[j].nodeName == 'componentref') {

                var componentrefID = this.reader.getString(childrenNode.children[j], 'id');

                if (this.components[componentrefID] == null)
                    this.components[componentrefID] = new MySceneComponent(componentrefID);

                currentComponent.childrenComponents.push(this.components[componentrefID]);
            }
            else if (childrenNode.children[j].nodeName == 'primitiveref') {

                var primitiverefID = this.reader.getString(childrenNode.children[j], 'id');

                if (this.primitives[primitiverefID] == null)
                    return "there is no primitive with ID = " + primitiverefID + "(conflict in component with ID=" + componentID + ")";

                currentComponent.childrenPrimitives.push(this.primitives[primitiverefID]);
            }

        }
        return null;
    }

    /**
   * Parses the <components> block.
   * @param {components block element} componentsNode
   */
    parseComponents(componentsNode) {
        var children = componentsNode.children;

        this.components = [];

        var grandChildren = [];
        var nodeNames = [];
        var currentComponent;

        // Any number of components.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "component") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current component.
            var componentID = this.reader.getString(children[i], 'id');
            if (componentID == null)
                return "no ID defined for componentID";

            // Checks for repeated IDs.
            if ((this.components[componentID] != null)) {

                if (this.components[componentID].loadedOk)
                    return "ID must be unique for each component (conflict: ID = " + componentID + ")";
                else
                    currentComponent = this.components[componentID];

            }
            else
                currentComponent = new MySceneComponent(componentID);

            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var transformationIndex = nodeNames.indexOf("transformation");
            var materialsIndex = nodeNames.indexOf("materials");
            var textureIndex = nodeNames.indexOf("texture");
            var childrenIndex = nodeNames.indexOf("children");
            var animationIndex = nodeNames.indexOf("animationref");


            // Transformations

            var transformationNode = grandChildren[transformationIndex];
            var transformationParsingResult = this.parseComponentTransformations(currentComponent, componentID, transformationNode);

            if (transformationParsingResult != null)
                return transformationParsingResult;

            // Animations

            if (animationIndex != -1) {
                var animation = grandChildren[animationIndex];

                var animationID = this.reader.getString(animation, 'id');

                currentComponent.animation = this.animations[animationID];
                this.animations[animationID].inUse = true;

            }

            // Materials

            var materialsNode = grandChildren[materialsIndex];
            var materialsParsingResult = this.parseComponentMaterials(currentComponent, componentID, materialsNode);

            if (materialsParsingResult != null)
                return materialsParsingResult;

            // Texture

            var textureNode = grandChildren[textureIndex];
            var textureParsingResult = this.parseComponentTexture(currentComponent, componentID, textureNode);

            if (textureParsingResult != null)
                return textureParsingResult;

            // Children

            var childrenNode = grandChildren[childrenIndex];
            var childrenParsingResult = this.parseComponentChildren(currentComponent, componentID, childrenNode);

            if (childrenParsingResult != null)
                return childrenParsingResult;


            currentComponent.loadedOk = true;
            this.components[componentID] = currentComponent;
        }

        for (var key in this.components) {

            if (!this.components[key].loadedOk)
                this.onXMLMinorError("the definition of a component with ID=" + this.components[key].id + " is missing");
        }


        var rootInSceneTree = false;


        for (var key in this.components) {

            if (this.components[key].id == this.idRoot)
                rootInSceneTree = true;

        }

        if (!rootInSceneTree)
            return "root element not defined in scene graph";


        this.log("Parsed components");
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    /**
     * Parse the attenuation components from a node. (constant, linear and quadratic). Returns an array with the three components.
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseAttenuation(node, messageError) {
        var attenuation = [];

        // constant attenuation component
        var cnst = this.reader.getFloat(node, 'constant');
        if (!(cnst != null && !isNaN(cnst) && cnst >= 0 && cnst <= 1))
            return "unable to parse constant component of the " + messageError;

        // linear attenuation component
        var linear = this.reader.getFloat(node, 'linear');
        if (!(linear != null && !isNaN(linear) && linear >= 0 && linear <= 1))
            return "unable to parse linear component of the " + messageError;

        // quadratic attenuation component
        var quadr = this.reader.getFloat(node, 'quadratic');
        if (!(quadr != null && !isNaN(quadr) && quadr >= 0 && quadr <= 1))
            return "unable to parse quadratic component of the " + messageError;

        attenuation.push(...[cnst, linear, quadr]);

        return attenuation;
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Recursively(depth-first) process the scene-graph(tree), displaying all primitives of the graph with the apropriate materials, textures and transformations. 
     * Materials,textures, transformations and scale-factors are passed
     * to the children nodes according to the specified lxs language. 
     * @param {graph node} node                     
     * @param {CGFappearance} activeMaterial 
     * @param {CGFtexture} activeTexture 
     * @param {Number} activeSScaleFactor 
     * @param {Number} activeLScaleFactor 
     */
    process(node, activeMaterial, activeTexture, activeSScaleFactor, activeLScaleFactor) {

        if (!node.loadedOk)
            return;

        var childTexture, childMaterial, childLengthS, childLengthT;

        // choose apropriate material and texture

        if (node.materials[node.currentMaterialIndex] == 'inherit')
            childMaterial = activeMaterial;
        else
            childMaterial = node.materials[node.currentMaterialIndex];

        // choose the apropriate texture
        if (node.textureBehaviour == 'defined') {

            childTexture = node.texture;
            childLengthS = node.textureLengthS;
            childLengthT = node.textureLengthT;
        }
        else if (node.textureBehaviour == 'inherit') {

            childTexture = activeTexture;
            childLengthS = activeSScaleFactor;
            childLengthT = activeLScaleFactor;
        }
        else if (node.textureBehaviour == 'none')
            childTexture = null;

        // apply the appropriate transformation

        this.scene.pushMatrix();
        this.scene.multMatrix(node.transformation);

        // apply the animation transformation if it exists
        if (node.animation != null)
            node.animation.apply();

        // process child nodes
        for (var i = 0; i < node.childrenComponents.length; i++) {

            this.process(node.childrenComponents[i], childMaterial, childTexture, childLengthS, childLengthT);
        }

        // process child primitives
        for (var i = 0; i < node.childrenPrimitives.length; i++) {

            childMaterial.setTexture(childTexture);                                     // set the texture
            childMaterial.setTextureWrap('REPEAT', 'REPEAT');                           // set the texture wrap
            childMaterial.apply();                                                      // apply the material   
            node.childrenPrimitives[i].scaleTex(childLengthS, childLengthT);            // apply scalefactors
            node.childrenPrimitives[i].display();                                       // display the primitive
            node.childrenPrimitives[i].resetTexCoords();                                // reset texture coordinates
        }

        this.scene.popMatrix();
    }

    /**
     * Change the material used by each component to the next one in the component internal material list (if any).
     * If the end of the list is reached the next material is the first one on the list (circular cycling).
     */
    cycleMaterials() {
        for (var key in this.components) {
            this.components[key].cycleMaterials();
        }
    }

    /**
     * Displays the scene, processing each node, starting in the root node(the rest are processed recursively).
     */
    displayScene() {

        var rootElement = this.components[this.idRoot];
        this.process(rootElement, new CGFappearance(this.scene), null, 1, 1);
    }
}