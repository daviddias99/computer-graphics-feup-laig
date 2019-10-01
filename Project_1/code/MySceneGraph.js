var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var GLOBALS_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var PRIMITIVES_INDEX = 7;
var COMPONENTS_INDEX = 8;

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

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

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
        if ((index = nodeNames.indexOf("ambient")) == -1)
            return "tag <ambient> missing";
        else {
            if (index != GLOBALS_INDEX)
                this.onXMLMinorError("tag <ambient> out of order");

            //Parse ambient block
            if ((error = this.parseAmbient(nodes[index])) != null)
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
        // TODO: Parse views and create cameras

        // check if there is a default value defined for the view
        var defaultId = this.reader.getString(viewsNode, 'default');
        if (defaultId == null)
            return "no default defined for view";

        var children = viewsNode.children;
        var grandChildren = [];
        this.views = [];

        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName == 'perspective') {

                // Get id of the current perspective
                var viewId = this.reader.getString(children[i], 'id');
                if (viewId == null)
                    return "no ID defined for perspective";

                // Checks for repeated IDs.
                if (this.views[viewId] != null)
                    return "ID must be unique for each view (conflict: ID = " + viewId + ")";

                // Get near clipping plane
                var viewNear = this.reader.getFloat(children[i], 'near');
                if (viewNear == null || isNaN(viewNear))
                    return "no near clipping plane distance defined";

                // Get far clipping plane
                var viewFar = this.reader.getFloat(children[i], 'far');
                if (viewFar == null || isNaN(viewFar))
                    return "no far clipping plane distance defined";
                
                // Get angle
                var viewAngle = this.reader.getFloat(children[i], 'angle');
                if (viewAngle == null || isNaN(viewAngle)) 
                    return "no field of view angle defined";

                // Validate to and from nodes
                grandChildren = children[i].children;
                var fromValues, toValues;
                var fromFlag = false, toFlag = false;
                for (var j = 0; j < grandChildren.length; j++) {
                    if (grandChildren[j].nodeName == 'from') {
                        var x = this.reader.getFloat(grandChildren[j], 'x');
                        if (x == null || isNaN(x))
                            return "no x component for from defined";

                        var y = this.reader.getFloat(grandChildren[j], 'y');
                        if (y == null || isNaN(y))
                            return "no y component for from defined";

                        var z = this.reader.getFloat(grandChildren[j], 'z');
                        if (z == null || isNaN(z))
                            return "no z component for from defined";

                        fromValues = vec3.fromValues(x, y, z);
                        fromFlag = true;
                    }
                    else if (grandChildren[j].nodeName == 'to') {
                        var x = this.reader.getFloat(grandChildren[j], 'x');
                        if (x == null || isNaN(x))
                            return "no x component for to defined";

                        var y = this.reader.getFloat(grandChildren[j], 'y');
                        if (y == null || isNaN(y))
                            return "no y component for to defined";

                        var z = this.reader.getFloat(grandChildren[j], 'z');
                        if (z == null || isNaN(z))
                            return "no z component for to defined";

                        toValues = vec3.fromValues(x, y, z);
                        toFlag = true;
                    }
                    else {
                        this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                    }
                }
                

                if (!toFlag) {
                    return "to not defined";
                }
                else if (!fromFlag) {
                    return "from not defined";
                }

                var view = new CGFcamera(viewAngle, viewNear, viewFar, fromValues, toValues);
                this.views[viewId] = view;
            }
            else if (children[i].nodeName == 'ortho') {
                // Get id of the current ortho
                var viewId = this.reader.getString(children[i], 'id');
                if (viewId == null)
                    return "no ID defined for ortho";

                // Checks for repeated IDs.
                if (this.views[viewId] != null)
                    return "ID must be unique for each view (conflict: ID = " + viewId + ")";

                // Get near clipping plane
                var viewNear = this.reader.getFloat(children[i], 'near');
                if (viewNear == null || isNaN(viewNear))
                    return "no near clipping plane distance defined";

                // Get far clipping plane
                var viewFar = this.reader.getFloat(children[i], 'far');
                if (viewFar == null || isNaN(viewFar))
                    return "no far clipping plane distance defined";
                
                // Get left bound of the frustum
                var viewLeft = this.reader.getFloat(children[i], 'left');
                if (viewLeft == null || isNaN(viewLeft)) 
                    return "no left bound for the frustum defined";
                
                // Get right bound of the frustum
                var viewRight = this.reader.getFloat(children[i], 'right');
                if (viewRight == null || isNaN(viewRight)) 
                    return "no right bound for the frustum defined";

                // Get top bound of the frustum
                var viewTop = this.reader.getFloat(children[i], 'top');
                if (viewTop == null || isNaN(viewTop)) 
                    return "no top bound for the frustum defined";

                // Get bottom bound of the frustum
                var viewBottom = this.reader.getFloat(children[i], 'bottom');
                if (viewBottom == null || isNaN(viewBottom)) 
                    return "no bottom bound for the frustum defined";

                // Validate to and from nodes
                grandChildren = children[i].children;
                var fromValues, toValues, upValues = vec3.fromValues(0, 1, 0);
                var fromFlag = false, toFlag = false;
                for (var j = 0; j < grandChildren.length; j++) {
                    if (grandChildren[j].nodeName == 'from') {
                        var x = this.reader.getFloat(grandChildren[j], 'x');
                        if (x == null || isNaN(x))
                            return "no x component for from defined";

                        var y = this.reader.getFloat(grandChildren[j], 'y');
                        if (y == null || isNaN(y))
                            return "no y component for from defined";

                        var z = this.reader.getFloat(grandChildren[j], 'z');
                        if (z == null || isNaN(z))
                            return "no z component for from defined";

                        fromValues = vec3.fromValues(x, y, z);
                        fromFlag = true;
                    }
                    else if (grandChildren[j].nodeName == 'to') {
                        var x = this.reader.getFloat(grandChildren[j], 'x');
                        if (x == null || isNaN(x))
                            return "no x component for to defined";

                        var y = this.reader.getFloat(grandChildren[j], 'y');
                        if (y == null || isNaN(y))
                            return "no y component for to defined";

                        var z = this.reader.getFloat(grandChildren[j], 'z');
                        if (z == null || isNaN(z))
                            return "no z component for to defined";

                        toValues = vec3.fromValues(x, y, z);
                        toFlag = true;
                    }
                    else if (grandChildren[j].nodeName == 'up') {
                        var x = this.reader.getFloat(grandChildren[j], 'x');
                        if (x == null || isNaN(x))
                            return "no x component for up defined";

                        var y = this.reader.getFloat(grandChildren[j], 'y');
                        if (y == null || isNaN(y))
                            return "no y component for up defined";

                        var z = this.reader.getFloat(grandChildren[j], 'z');
                        if (z == null || isNaN(z))
                            return "no z component for up defined";

                        upValues = vec3.fromValues(x, y, z);
                    }
                    else {
                        this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                    }
                }

                if (!toFlag) {
                    return "to not defined";
                }
                else if (!fromFlag) {
                    return "from not defined";
                }
                
                var view = new CGFcameraOrtho(viewLeft, viewRight, viewBottom, viewTop, viewNear, viewFar, fromValues, toValues, upValues);
                this.views[viewId] = view;
            }
            else {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
            }
        }

        if (this.views[defaultId] == null)
            return "a view with a default id is not defined";

        return null;
    }

    /**
     * Parses the <ambient> node.
     * @param {ambient block element} ambientsNode
     */
    parseAmbient(ambientsNode) {

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
                attributeNames.push(...["location", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["position", "color", "color", "color"]);
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

            enableLight = aux || 1;

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
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (!Array.isArray(aux))
                        return aux;

                    global.push(aux);
                }
                else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
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

                global.push(...[angle, exponent, targetLight])
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

            var source_img = new Image();
          

            source_img.onload = function (sceneGraph) {

                // Check image dimensions
                if (!isPowerOfTwo(source_img.width) || !isPowerOfTwo(source_img.height))
                    sceneGraph.onXMLMinorError("Texture with ID = " + textureId + " has dimensions that are not powers of 2");

            }(this);


            // Get id of the current texture.
            var textureId = this.reader.getString(children[i], 'id');
            if (textureId == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.textures[textureId] != null)
                return "ID must be unique for each texture (conflict: ID = " + textureId + ")";

            var textureSrcPath = this.reader.getString(children[i], 'file');

            // Check for valid extension
            var fileExtension = getExtension(textureSrcPath)
            if (fileExtension != "png" && fileExtension != "jpg")
                return "Invalid extension for texture source file (conflict: ID = " + textureId + ")";

            //TODO: Fix powers of two checking
            

            

            source_img.src = textureSrcPath;

            



            this.textures[textureId] = new CGFtexture(this.scene, textureSrcPath);
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
        var nodeNames = [];
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
            var shininessValue = this.reader.getString(children[i], 'shininess');
            if (shininessValue == null)
                return "no shininess defined for material with ID = " + materialID;

            grandChildren = children[i].children;

            // Reads the names of the material parameters to an auxiliary buffer.
            var grandChildrenNames = [];

            for (var i = 0; i < grandChildren.length; i++)
                grandChildrenNames.push(grandChildren[i].nodeName);

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
     * Parses the <transformations> block.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {
        var children = transformationsNode.children;

        this.transformations = [];

        var grandChildren = [];

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

            grandChildren = children[i].children;
            // Specifications for the current transformation.

            var transfMatrix = mat4.create();

            for (var j = 0; j < grandChildren.length; j++) {
                switch (grandChildren[j].nodeName) {
                    case 'translate':
                        var coordinates = this.parseCoordinates3D(grandChildren[j], "translate transformation for ID " + transformationID);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
                        break;
                    case 'scale':
                        // TODO: Parse scale transformations                     
                        this.onXMLMinorError("TODO: Parse scale transformations.");
                        break;
                    case 'rotate':
                        // angle
                        // TODO: Parse rotate transformations
                        this.onXMLMinorError("TODO: Parse rotate transformations.");
                        break;
                }
            }
            this.transformations[transformationID] = transfMatrix;
        }

        this.log("Parsed transformations");
        return null;
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
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.primitives[primitiveId] != null)
                return "ID must be unique for each primitive (conflict: ID = " + primitiveId + ")";

            grandChildren = children[i].children;

            // Validate the primitive type
            if (grandChildren.length != 1 ||
                (grandChildren[0].nodeName != 'rectangle' && grandChildren[0].nodeName != 'triangle' &&
                    grandChildren[0].nodeName != 'cylinder' && grandChildren[0].nodeName != 'sphere' &&
                    grandChildren[0].nodeName != 'torus')) {
                return "There must be exactly 1 primitive type (rectangle, triangle, cylinder, sphere or torus)"
            }

            // Specifications for the current primitive.
            var primitiveType = grandChildren[0].nodeName;

            // Retrieves the primitive coordinates.
            if (primitiveType == 'rectangle') {
                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2) && x2 > x1))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2) && y2 > y1))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                var rect = new MyRectangle(this.scene, primitiveId, x1, x2, y1, y2);

                this.primitives[primitiveId] = rect;
            }
            else {
                // TODO: Parse other primitives
                console.warn("TODO: Parse other primitives.");
            }
        }

        this.log("Parsed primitives");
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
        var grandgrandChildren = [];
        var nodeNames = [];

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
            if (this.components[componentID] != null)
                return "ID must be unique for each component (conflict: ID = " + componentID + ")";

            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var transformationIndex = nodeNames.indexOf("transformation");
            var materialsIndex = nodeNames.indexOf("materials");
            var textureIndex = nodeNames.indexOf("texture");
            var childrenIndex = nodeNames.indexOf("children");


            // TODO: Parse components
            this.onXMLMinorError("TODO: Parse components.");
            // Transformations

            // Materials

            // Texture

            // Children
        }
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
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        //TODO: Create display loop for transversing the scene graph

        //To test the parsing/creation of the primitives, call the display function directly
        this.primitives['demoRectangle'].display();
    }
}