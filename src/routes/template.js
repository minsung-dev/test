const express = require('express');
const {default: asyncify} = require("express-asyncify");
const router = asyncify(express.Router());
const {apiCall} = require("../lib");

router.get('/health', async (req, res) => {
  return res.json({'test': 'running'});
});


router.get('/', async (req, res) => {
  const portfolioList = await apiCall({
    url: '/service/v1/portfolio?type=portfolio'
  }).then((res) => res.data);

  const projectList = await apiCall({
    url: '/service/v1/portfolio?type=project'
  }).then((res) => res.data);


  res.render('landing.njk', {
    portfolioList,
    projectList
  });
});

module.exports = router;
