import * as d3 from 'd3';

export const loadLeaf = (path) => {
  return ajaxSVG(path);
}

export const ajaxSVG = (path) => {
  return new Promise((resolve, reject) => {
    d3.xml(path,
      (xml) => {
        const result = xml.getElementsByTagName("svg")[0];
        if( result ) {
          resolve(result);
        } else reject('Loading of leaf data failed');
      });
  });
};