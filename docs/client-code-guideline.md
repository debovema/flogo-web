# Client application coding  guidelines
A style guide for syntax, conventions, and structuring Angular applications 
  
## Required Libraries and Tools for Developers and QA   
You must have the following installed on your machine:
   
### Libraries   
The following libraries need to be available on your machines:   
- [Angular.js 2.x](https://angular.io)   
   
### Tools
- [NPM](https://www.npmjs.com/)
   
###Style Guides for Reference   
Refer to the following style guides if need be:

- [JavaScript Style Guide](https://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml)
- [HTML/CSS Style Guide](https://google-styleguide.googlecode.com/svn/trunk/htmlcssguide.xml)
- [AngularJS 2.x Style Guide](https://github.com/johnpapa/angular-styleguide/blob/master/a2/README.md)
	

## Guidelines for Developers   

### One component, directive, service, filter... per file, and add meaningful suffix.
**Valid Suffix**

1. component
2. directive
3. service
4. pipe
5. spec
6. lang
7. e2e
8. interface
9. model
10. tpl

When you define class, you also need to add `Component`, `Directive`... as suffix

### A module folder example

```
app
    |-- components
        |-- app.component.ts
        |-- app.tpl.html
        |-- app.component.lang.json
        |-- app.component.css
        |-- app.component.spec.ts
        |-- app.component.e2e.ts
    |-- directives
        |-- app.directive.ts
        |-- app.directive.spec.ts
        |-- app.directive.e2e.ts
    |-- services
    |-- models
    |-- messages.ts
```

1. File name use lower case
2. If name more than one word, use - to connect them. For example `app-detail.component.ts`
1. The `messages.ts` holds the information of publish/subscribe events of a module (outgoing/incoming messages)

#### The messaging mechanism and `messages.ts` file

Modules communicating through messaging mechanism using the `common/services/post.services.ts`, which is based on [`Postal`](https://www.npmjs.com/package/postal).

For the moment, considering decoupling, the solution is to implement a `messages.ts` within the module folder if the module need to communicate with the others through the message mechanism. The parent module will use the information of the `messages.ts` of its children modules to glue the children modules together.

In this case, development of the child module or the same level module could be independent. The one of the cons of this approach is that the parent module have to take responsibility to glue its children and pass the messages of its children modules.

##### Example of a `messages.ts`

```javascript
/**
 * Events published from this module
 */

export const PUB_EVENTS = {
  addTask : {
    channel : 'mock-flogo-flows-detail-diagram',
    topic : 'add-task'
  }
};

/**
 * Events subscribed by this module
 */

export const SUB_EVENTS = {
  addTask : {
    channel : 'mock-flogo-flows-detail-diagram',
    topic : 'public-add-task'
    // , data: {
    //   task: {
    //     id: "task id",
    //     name: "task name",
    //     ...
    //   },
    //   ...
    // }
  }
};

```

___Note___ that the commented `data` field is used to provide an exmaple of the required information of that message, and the `topic` field is prefixed with `public-`.


##### Example of usage

```typescript

/**
 * inside the child module
 * `this` is the class of the module
 */

// ...
  // subscribe incoming message
  this._postService.subscribe( _.assign( {}, SUB_EVENTS.addTask, { callback : this._addTaskDone.bind( this ) } ) )
  
  // publish the outgoing message
  this._postService.publish( _.assign( {}, PUB_EVENTS.addTask, { data : data } ) );
// ...

/**
 * inside the parent module
 * `this` is the class of the module
 */
 
// ...
  // subscribe message from child module
  this._postService.subscribe( _.assign( {}, PUB_EVENTS.addTask, { callback : this._addTaskFromChild.bind( this ) } ) )
  
  // do the magic
  
  // publish message to the child module
  this._postService.publish( _.assign( {}, SUB_EVENTS.addTask, { data : data } ) );
// ...


```



__TODO:__ in the future, new messaging mechanism will be introduced to replace this one.


### Avoid name collision, use module name as prefix, this rule for class name, directive name, selector name...

### Use attributes as selectors for directive, so one element can have multiple directives

### Use element as selectors for component.

### Selector naming rule. Element selector use `kebab-case`, attribute or class selector use `lowerCamelCase`

### Use `lowerCamelCase` for naming the selectors of your directives



## Reference

1. [https://mgechev.github.io/angular2-style-guide/](https://mgechev.github.io/angular2-style-guide/)
2. [Angular 2 Style Guide](https://github.com/johnpapa/angular-styleguide/tree/master/a2)