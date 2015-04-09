  /**
   * -----------------------------------------------------
   * Public Class (Categories)
   * -----------------------------------------------------
   * @desc The available categories for each question.
   * @param {?(objectMap|stringMap)} categories - The user's categories.
   * @constructor
   */
  var Categories = function(categories) {

    /** @type {strings} */
    var subIds;

    // $s$
    /**
     * ---------------------------------------------------
     * Public Property (Categories.debug)
     * ---------------------------------------------------
     * @desc The Debug instance for the Categories class.
     * @type {Debug}
     */
    this.debug = aIV.debug('Categories');

    this.debug.group('init', 'coll', 'categories= $$', categories);
    this.debug.start('init', categories);
    this.debug.args('init', categories, 'objectMap|stringMap');
    // $e$
    /**
     * ----------------------------------------------- 
     * Protected Property (Categories.data)
     * -----------------------------------------------
     * @desc Saves a hash map of the category objects using the ids as keys.
     * @type {Object<string, Category>}
     * @private
     */
    var data;

    /**
     * ----------------------------------------------- 
     * Public Property (Categories.ids)
     * -----------------------------------------------
     * @desc Saves an array of all the main category ids in alphabetical order.
     * @type {strings}
     */
    this.ids;

    /**
     * ----------------------------------------------- 
     * Public Property (Categories.len)
     * -----------------------------------------------
     * @desc Saves the count of main categories.
     * @type {number}
     */
    this.len;

    /**
     * ----------------------------------------------- 
     * Public Property (Categories.get)
     * -----------------------------------------------
     * @desc Get a category object or property.
     * @param {string} id - The category id to get.
     * @param {string=} prop - If only one property is desired
     *   state it here.
     * @return {(Category|string|nums)}
     */
    this.get = function(id, prop) {

      var debugMsg;
      this.debug.start('get', id, prop);
      this.debug.args('get', id, 'string', prop, 'string=');

      debugMsg = 'Error: The given category does not exist. catID= $$';
      this.debug.fail('get', data.hasOwnProperty(id), debugMsg, id);

      return ( ( !data.hasOwnProperty(id) ) ?
        false : (!!prop) ?
          data[id].get(prop) : data[id]
      );
    };
    Object.freeze(this.get);


    // Check the argument data types
    if ( checkType(categories, '!stringMap') ) {
      categories = {
        main: categories,
        sub : {}
      };
    }
    else {
      if (!categories) {
        categories = {};
      }
      if (!categories.main || !checkType(categories.main, '!stringMap')) {
        categories.main = {};
      }
      if (!categories.sub || !checkType(categories.sub, '!objectMap')) {
        categories.sub = {};
      }
    }

    // Setup the properties
    this.ids = Object.keys(categories.main);
    this.len = this.ids.length;
    data = {};

    if (this.len) {

      // Sort the main category ids
      this.ids = sortKeys(this.ids, categories.main);

      // Build the hash map
      this.ids.forEach(function(/** string */ mainId) {

        // Save and sort the sub category ids if they exist
        subIds = null;
        if ( categories.sub.hasOwnProperty(mainId) ) {
          subIds = Object.keys(categories.sub[ mainId ]);
          if (subIds && subIds.length) {
            subIds = sortKeys(subIds, categories.sub[ mainId ]);
          }
        }

        // Add main category to the hash map
        data[ mainId ] = new Category(categories.main[ mainId ], subIds);
        Object.freeze(data[ mainId ]);

        // Add the sub categories to the hash map
        if (subIds && subIds.length) {
          subIds.forEach(function(/** string */ subId) {
            data[ subId ] = new Category(categories.sub[ mainId ][ subId ]);
            Object.freeze(data[ subId ]);
          });
        } 
      });
    }

    Object.freeze(this.ids);
    Object.freeze(data);

    // Close this debug console group
    this.debug.group('init', 'end');
  };

  // Ensure constructor is set to this class.
  Categories.prototype.constructor = Categories;
