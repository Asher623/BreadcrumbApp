import React from "react";
import {Breadcrumbs as MUIBreadcrumbs, Typography} from "@material-ui/core";
import { withRouter } from "react-router-dom";
import durableJsonLint from 'durable-json-lint'
import { Route, Link} from 'react-router-dom';



const Breadcrumbs = props =>{
    const {
        history,
        location: { pathname }
      } = props;
    var decodeHtmlEntity = function(str) {
        return str.replace(/&#(\d+);/g, function(match, dec) {
          return String.fromCharCode(dec);
        });
      };
    
    let root = JSON.parse(durableJsonLint(decodeHtmlEntity(`{
        type: &#34;dir&#34;,
        children: {
        home: {
        type: &#34;dir&#34;,
        children: {
        myname: {
        type: &#34;dir&#34;,
        children: {
        &#34;filea.txt&#34;: {
        type: &#34;file&#34;,
        },
        "fileb.txt": {
        type: &#34;file&#34;,
        },
        "projects": {
        type: &#34;dir&#34;,
        children: {
        mysupersecretproject: {
        type: &#34;dir&#34;,
        children: {
        mysupersecretfile: {
        type: &#34;file&#34;,
        },
        },
        }
        },
        },
        }
        },
        },
        }
        },
        }`)).json);

    let routes = [];

        let mainPath = "";
        
    const iterate =  (obj, objName, fullPath) => {
    
        Object.keys(obj).forEach( key => {

    if (key === "type" && obj[key] === "dir" && typeof objName != 'undefined'){
        
        mainPath = fullPath + '/' + objName;

        if(routes.length > 0){
            routes[routes.length-1].sidebar = () => <Link onClick={()=>history.push(fullPath + '/' + objName)}><h2>{objName}</h2></Link>;
        }
        
        routes.push({path: mainPath,
        exact: true,
        name: objName,
        sidebar: () => <div><h2>{objName}</h2></div>,
        main: () => <p> </p>});

    }else if (key === "type" && obj[key] === "file" && typeof objName != 'undefined'){
        
        let newFiles = routes[routes.length-1].main().props.children + " File: " + objName
        
        routes[routes.length-1].main = () =><p>{newFiles}</p>;
        
    }
        if (typeof obj[key] === 'object') {
            
                iterate(obj[key], key, mainPath)
            }
        })
    }
     
    iterate(root)
    const pathnames = pathname.split("/").filter(x => x);
    
    return(
        <>
        <MUIBreadcrumbs aria-label="breadcrumb">
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        return isLast ? (
          <Typography key={name}>{name}</Typography>
        ) : (
          <Link key={name}  onClick={() => history.push(routeTo)}>
            {name}
          </Link>
        );
      })}
      
    </MUIBreadcrumbs>
    {routes.map((route) => (
                <Route
                    key={route.path}
                    path={route.path}
                    exact={route.exact}
                >
                    <route.sidebar />
                    <route.main />
                </Route>
            ))}
        </>
    )
}

export default withRouter(Breadcrumbs);