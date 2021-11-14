# [Engagement Builder](https://github.com/vinay-anantha1/engagement-builder)

## ![Netlify Status](https://api.netlify.com/api/v1/badges/861e8178-5cf2-409a-a9d3-a8f820914740/deploy-status)
## Project description
An effective open source Engagement Builder UI component to facilitate users to create personalised journey for customer interactions across multiple engagement channels at various stages of customer journey.

## Table of contents
 -  [Project description](#project-description)
 -  [Table of contents](#table-of-contents)
 -  [Motivation](#motivation)
 -  [Demo preview](#demo-preview)
 -  [Installation](#installation)
 -  [Features](#features)
 -  [Sreenshots](#screenshots)
 -  [Code overview](#code-overview)
 -  [Authors](#authors)
 -  [Contributing](#contributing)
 -  [Future plan](#future-plan)
 - [References & Credits](#references)
 - [License](#license)
## Motivation
- An attempt to create an open source journey builder to help individuals/organization to create an effective journey for their users.
-  This can be customized as per the requirement.
## Demo preview
- [It's hosted on netlify!! Try it out](https://engagement-builder-foss21.netlify.app/
)
- [Youtube demo video](https://youtu.be/BPuzUTmd540)

## Screenshots

![image](https://user-images.githubusercontent.com/87369680/141683378-7c0d783b-5058-4c23-b1f0-7c9c4ceec325.png)

![image](https://user-images.githubusercontent.com/87369680/141683629-18edd550-0a0b-47a4-a73f-fb21bc5f1c65.png)

![image](https://user-images.githubusercontent.com/87369680/141683498-360f36fa-87a1-4cab-a357-7d394da03cf7.png)

 ## Installation
 Clone the project to your system
```bash
git clone git@github.com:vinay-anantha1/engagement-builder.git
```
Install all the dependencies
```bash
npm i --save
```
Start the project on browser
```bash
npm start
```
## Features
* Easy to use interface. Just drag and drop icons to create stunning user journeys.
* Can be customised to add any icon in the left drag and drop palette, by just specifying the sidebar props. [see below](#code-overview)
* Can easily add or remove blocks from journey.
* Few use cases may include creating user journey flows for 
  - Educational Institutes(library journey flow to setup reminders if books aren't returned on timeline) 
  - Hospitals(setup flows for regular checkups and reminders) 
  - Billings(for payment remiders)
  - Retail & E-commerce(Journey flows ranging from shopping experience to customer retention)

## Code overview
  These are the main areas which can used to customize the app. [Refer this doc file for example](https://github.com/vinay-anantha1/engagement-builder/blob/master/src/doc/EngDndGraphDoc/index.js)
  - EngDndGraph must be wrapped around DndProvider with backend={HTML5Backend}
  - The props accepted by EngDndGraph are as follows :
    - props: whose structure is mentioned below
    - graphNodes : which will be rendered by the EngDndGraph
    - setGraphNodes : callback to setGraphNodes
    - onClickConfigure is a callback being passed to execute some action when configure icon is clicked for a block
    - onDropNewNode is used to update parent state 'journeyBlockDetails' which holds info about configurations of graph block nodes.

```
 <DndProvider backend={HTML5Backend}>
      <EngDnDGraph
        {...props}
        graphNodes={graphNodes}
        setGraphNodes={setGraphNodes}
        onClickConfigure={onClickConfigure}
        onDropNewNode={onDropNewNode} 
      />
 </DndProvider>
```
The props passed required for initial rendering
```
{
  sidebarProps: {
    sidebarTitle: 'Building blocks',
    sidebarDescription: 'Drag & drop blocks to create the journey',
    nodes: sidebarNodes,
  },
  initialGraphData,
  dndGraphId: 'journey-graph-container',
};

```
Below is the initialGraphData being passed to display placeholder nodes during initial render when no block nodes are added

```
[
  entryTrigger,
  {
    id: 'emptyGraphText',
    component: Label,
    props: {
      children: 'Drag and drop building blocks to complete the journey',
      color: COLORS.LIGHT_GREY,
    },
    showEdge: false,
    width: 180,
    height: 40,
    type: 'EMPTY_GRAPH_TEXT',
  },
  {
    from: '1',
    id: '2',
    component: EngBorderedBox,
    to: ['3'],
    type: 'PLACEHOLDER_NODE',
    width: 48,
    height: 48,
  },
  {
    from: '6',
    id: '7',
    component: EngIcon,
    props: endIconProps,
    type: 'END_NODE',
    width: 48,
    height: 48,
  },
];

```
The sidebar on the left consisting of the engagement icons and flow actions that can be customized to show any icons.<br/> The sidebar props consists of the following structure. the 'type' property in children object is used to provide Icon type. For example if the Antd icon component for Up arrow is < ArrowUpOutlined /> then  the type = 'ArrowUpOutlined'

```
[
  {
    key: 'engagements',
    title: 'Engagements',
    children: [
      {
        id: 'sms',
        type: ICON_TYPES.SMS,
        label: 'SMS',
      },
      {
        id: 'email',
        type: ICON_TYPES.EMAIL,
        label: 'Email',
      },
    ],
    color: COLORS.YELLOW,
  },
  {
    key: 'flowControl',
    title: 'Flow Control',
    children: [
      {
        id: 'wait',
        type: ICON_TYPES.WAIT,
        label: 'Wait',
      },
    ],
    color: COLORS.BLUE,
  },
];
``` 
# Authors
- [Vinay Anantha](https://github.com/vinay-anantha1)
- [Rishi Jain](https://github.com/rishiui)
- [Rakesh Talukdar](https://github.com/rakesh-talukdar)

## Contributing
Anyone can contribute to this project by adding new features or fixing bugs using the below steps.
```
Fork the repository 
```
```
Pull the master branch 
```
```
Create your own branch
```
```
Push the changes in your own branch
```
```
Create a pull request with base master branch
```
## Future plan
* Making icon selection palette even more customizable via user inputs.
* Making icon sidebar expand/collapsible on clicks.
* 'Join' flows for combining journey paths. 
* Dark mode support :P
* Multilingual support

## References & Credits
* [ReactJS](https://reactjs.org/)
* [React DnD](https://react-dnd.github.io/react-dnd/about)
* [antD](https://ant.design/)
* [antV/x6](https://x6.antv.vision/en/docs/api/graph/minimap)
* [uistore.design](https://www.uistore.design/items/people-working-collaborating-free-illustrations/)
 ## License
 This project is [MIT](https://github.com/vinay-anantha1/engagement-builder/blob/master/LICENSE) licensed.
