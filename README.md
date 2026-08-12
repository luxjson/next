
   <!--
      - This Source Code Form is subject to the terms of the Mozilla Public
      - License, v. 2.0. If a copy of the MPL was not distributed with this
      - file, You can obtain one at http://mozilla.org/MPL/2.0/.
      -->
   <!-- TODO: Get a job -->
   <img src="https://github.com/luxjson/luxjson.github.io/blob/main/src/assets/images/icon2.png" width="100px" height="100px" style="border-radius: 30%" align="left">
   <img src="https://skillicons.dev/icons?i=nextjs&perline=1" />

   ### `LUXJSON (NextJS Version)`
   

   ![Status](https://img.shields.io/badge/STATUS-OPERATIONAL-green)
   ![Version](https://img.shields.io/badge/VERSION-1.0-gold)
   ![OS](https://img.shields.io/badge/OS-WEB-red)
   
   **LUXJSON (NextJS Version)** - An portfolio website.
   
   <div flex="true">
     <a href="https://luxjson.github.io">
       Check Out
     </a>
     •
     <a href="https://github.com/luxjson/luxjson.github.io/deployments">
       Release Notes
     </a>
   </div>
   
   
   ### Contributing
   
   If you'd like to report a bug, please do so on our [GitHub Issues page](https://github.com/luxjson/luxjson.github.io/issues/new/choose)

   ### Directory Structure

```
Portfolio
├───app
│   ├───admin
│   │   ├───posts
│   │   │   ├───edit
│   │   │   │   └───[id]
│   │   │   │       └───page.jsx
│   │   │   ├───new
│   │   │   │   └───page.jsx
│   │   │   └───page.jsx
│   │   ├───settings
│   │   │   └───page.jsx
│   │   └───page.jsx
│   ├───api
│   │   └───[...path]
│   │       └───route.js
│   ├───blog
│   │   ├───[slug]
│   │   │   └───page.jsx
│   │   └───page.jsx
│   ├───insomnia
│   │   └───page.jsx
│   ├───login
│   │   └───page.jsx
│   ├───_not-found
│   │   └───page.jsx
│   ├───layout.jsx
│   └───page.jsx
├───components
│   ├───legacy-pages
│   │   ├───Admin
│   │   │   ├───DashboardHome.jsx
│   │   │   ├───Layout.jsx
│   │   │   ├───PostForm.jsx
│   │   │   └───PostsList.jsx
│   │   ├───Blog.jsx
│   │   ├───BlogPost.jsx
│   │   ├───insomnia.jsx
│   │   ├───Login.jsx
│   │   ├───luxjson.jsx
│   │   └───NotFound.jsx
│   ├───BlogCard.jsx
│   └───ProtectedRoute.jsx
├───context
│   └───AuthContext.jsx
├───hooks
│   └───useExternalStyle.jsx
├───lib
│   ├───admin.js
│   ├───auth.js
│   ├───blog.js
│   └───db.js
├───public
│   └───assets
├───utils
├───.gitignore
├───eslint.config.js
├───next.config.mjs
├───package-lock.json
├───package.json
└───README.md
```