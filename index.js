/*
  Name: Sijia Xiao (Lena)
  Date: Oct. 29, 2018
  Section: CSE 154 AE
  This javascript file will accept user input for guitar root, quality, Tension
  and Bass. Users can get the exact chord, strings they need to play and fingers
  they will use to play this chord. And a table will be generated for this chord.

            ~~~~~~~~~~~~~~~~~
          /                  \    |- - - -|
        /    ( * )            \   |  +  | |
      /                        \  |_____| |
     +____________________________________|
*/

(function() {
  'use strict';

  window.addEventListener('load', init);

  const URLBASE = 'https://api.uberchord.com/v1/chords';  // contains all chords records
  const ORI_KEY = ['Cb', 'G#', 'F#', 'D#', 'C#', 'A#'];
  const ENHARM_KEY = ['B', 'Ab', 'Gb', 'Eb', 'Db', 'Bb'];
  /**
   * start searching by clicking.
  */
  function init() {
    qs('input[name=search-all]').addEventListener('click', search);
    qs('input[name=search-one]').addEventListener('click', search);
  }

  /**
   * wrap all the actions after click button and build url to fetch data.
  */
  function search() {
    removeAll();
    $('output').classList.remove('flexIt');
    let chordName = makeChord();
    let url = URLBASE + '?nameLike=';
    if (this.name == 'search-one') {
      url = URLBASE + '/';
    }
    fetchData(url + chordName);
  }

  /**
   * make the legal query message for url.
   * @return {string} a legal name for query
  */
  function makeChord() {
    let root = qs('input[name=root]').value;
    root = root.charAt(0).toUpperCase() + root.slice(1);
    root = enharmonicChord(root);
    let quality = $('quality').value;
    if (root !== '') {
      quality = '_' + quality;
    }
    let tension = qs('input[name=tension]').value;
    let bass = qs('input[name=bass]').value;
    return root + quality + tension + '_' + bass;
  }

  /**
   * fetch data of chords from url.
   * @param {string} url - accpet query url
  */
  function fetchData(url) {
    fetch(url)
      .then(checkStatus)
      .then(JSON.parse)
      .then(findAll)
      .catch(handleError);
  }

  /**
   * print error message if it doesn't fetch any data in the array, otherwise,
   * make a table that display chord name, strings to picking, finger pattern and
   * tones echoed.
   * @param {string} data - JSON of the chord information.
  */
  function findAll(data) {
    const column = ['Chords Name', 'Strings', 'Fingering', 'Tones'];
    if (data.length <= 0) {
      let message = errorInfo();
      message.innerText = 'Please check your input. This chord does not exist!';
    } else {
      let table = create('table');
      let tr = create('tr');
      tr = addCellToRow(column, tr, 'th');
      table.appendChild(tr);
      $('output').appendChild(table);
      addDataToRow(data);
    }
  }

  /**
   * Modify chord name for the table and add chord name, string pattern,
   * fingering pattern and tones to the rows.
   * @param {string} data - JSON of the chord information.
  */
  function addDataToRow(data) {
    for (let i = 0; i < data.length; i++) {
      let name = data[i].chordName;
      name = name.split(',');
      let newName = '';
      for (let letter = 0; letter < name.length; letter++) {
        newName += name[letter];
      }
      let items = [newName, data[i].strings, data[i].fingering, data[i].tones];
      let row = create('tr');
      row = addCellToRow(items, row, 'td');
      qs('table').appendChild(row);
    }
  }

  /**
   * create a element to display error message
   * @return {object} a block to display error message
  */
  function errorInfo() {
    $('output').classList.add('flexIt');
    let message = create('div');
    $('output').appendChild(message);
    return message;
  }

  /**
   * display error message when fetch data fails.
  */
  function handleError() {
    let message = errorInfo();
    message.innerText = 'An error has occurred when making request! Try it later!';
  }

  /**
   * replace enharmonic root in the chord name, otherwise the url is illegal.
   * @param {string} root - user input for root note of the chord
   * @return {string} replaced root info
  */
  function enharmonicChord(root) {
    let index = ORI_KEY.indexOf(root);
    if (index !== -1) {
      root = ENHARM_KEY[index];
    }
    return root;
  }

  /**
   * create cell for the table and associate the cell to the table.
   * @param {array} column - first row of the table
   * @param {object} tr - table row object.
   * @param {string} el - element type for the cell
   * @return {object} table row object
  */
  function addCellToRow(column, tr, el) {
    for (let i = 0; i < column.length; i++) {
      let cell = create(el);
      cell.appendChild(document.createTextNode(column[i]));
      tr.appendChild(cell);
    }
    return tr;
  }

  /**
   * remove all children within output.
  */
  function removeAll() {
    let all = $('output').children;
    for (let i = 0; i < all.length; i++) {
      $('output').removeChild(all[i]);
    }
  }

  /* ==============================  Helper Functions ============================== */
  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} response - response to check for success/error
   * @return {object} - valid result text if response was successful, otherwise rejected
   *                    Promise result
   */
  function checkStatus(response) {
    if (response.status >= 200 && response.status < 300 || response.status == 0) {
      return response.text();
    } else {
      return Promise.reject(new Error(response.status + ": " + response.statusText));
    }
  }

  /**
   * Return the element that has been created
   * @param {string} el - element type to be created
   * @return {object} new element
  */
  function create(el) {
    return document.createElement(el);
  }

  /**
   * Return the element that has the ID attribute with the specified value.
   * @param {string} id - element id
   * @return {object} DOM object associated with id
  */
  function $(id) {
    return document.getElementById(id);
  }

  /**
   * Return the element that has the class name or tag.
   * @param {string} name - element class name or tag.
   * @return {object} object that has such class name or tag.
  */
  function qs(name) {
    return document.querySelector(name);
  }

})();
