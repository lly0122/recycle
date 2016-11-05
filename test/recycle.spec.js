import {expect} from 'chai'
import jsdomify from 'jsdomify'
import reactAdapter from '../src/adapter/react-rxjs'
import React from 'react'
import ReactDOM from 'react-dom'
import Recycle from '../src/recycle'

let adapter = reactAdapter()
let recycle = Recycle(adapter)
let Observable = adapter.Observable

describe('unit tests', function() {
  
  describe('updateDomStreams', () => {
    before(function() {
      jsdomify.create()
    })

    after(function() {
      jsdomify.destroy()
    })

    it('should call observer.next', function(done) {
      let domSelectors = {
        test: {
          click: recycle.makeSubject()
        }
      }
      domSelectors.test.click.observer.next = function() {
        done()
      }
      let el = document.createElement('div')
      recycle.updateDomStreams(domSelectors, el)
    }) 
  })
  
  describe('createStateStream', () => {

    it('should create new state and notify', function(done) {
      const subj = recycle.makeSubject()

      const reducers = [
        subj.stream
          .reducer(function(state) {
            state.test = true;
            return state
          })
      ]

      let initialState = { test: false }

      let notify = function(action) {
        expect(action.type).to.equal('willCallReducer')
      }

      const state$ = recycle.createStateStream(reducers, initialState, notify)

      state$.subscribe(function(state) {
        if (state.test == true)
          done()
      })

      subj.observer.next()
    })
  })
  
  describe('createActionsStream', () => {

    it('should create action stream and filter null values', function(done) {
      const subj = recycle.makeSubject()

      const actions = [
        subj.stream,
        subj.stream.mapTo(false)
      ]

      const actions$ = recycle.createActionsStream(actions)

      actions$.subscribe(function(action) {
        expect(action.type).to.equal('testActions')
        done()
      })

      subj.observer.next()
      subj.observer.next({type: 'testActions'})
    })
  })

  describe('registerComponent', () => {

    it('should add new component in map', function() {
      let savedChildren = new Map()

      let constructor1 = function(){ return {} }
      let constructor2 = function(){ return {} }

      let component1 = recycle.Component(constructor1, 'key1')
      let component2 = recycle.Component(constructor1, 'key1')
      
      recycle.registerComponent(component1, savedChildren)

      expect(savedChildren.get(constructor1)['key1'] !== false)
        .to.equal(true)

      expect(function() {
        recycle.registerComponent(component2, savedChildren)
      })
      .to.throw(`Could not register recycle component 'constructor1'. Key 'key1' is already in use.`)
    })
  })

  describe('isReactComponent', () => {

    it('should check if component is created with react', function() {
      let reactComponent = React.createClass({
        render() {} 
      })
      
      expect(recycle.isReactComponent(reactComponent)).to.equal(true)
    })
  })

  describe('createReactElement', () => {

    before(function() {
      jsdomify.create()
    })

    after(function() {
      jsdomify.destroy()
    })

    it('should pass jsx as property in react render method', function(done) {
      let reactComponent = React.createClass({
        render(jsx) {
          jsx()
          return null
        } 
      })

      let getArgs = function(constrctor, props) {
        return arguments
      }

      let jsx = function() {
        done()
      }

      ReactDOM.render(
        recycle.createReactElement(React.createElement, getArgs(reactComponent), jsx), 
        document.createElement('div')
      )
    })
  })
  
  describe('mergeChildrenActions', () => {

    before(function() {
      jsdomify.create()
    })

    after(function() {
      jsdomify.destroy()
    })
    
    it('should return action created by recycle component', function(done) {

      const subj = recycle.makeSubject()

      let constructor = function() {
        return {
          actions: function() {
            return subj.stream
          },
          view: () => {
            return null
          }
        }
      }

      let rc = recycle.Component(constructor)

      ReactDOM.render(
        React.createElement(rc.getReactComponent(), null), 
        document.createElement('div')
      )

      let merged$ = recycle.mergeChildrenActions([rc])

      rc.getActions().subscribe(function(action) {
        expect(action.type).to.equal('testActions')
        done()
      })

      subj.observer.next()
      subj.observer.next({type: 'testActions'})
    })
  })
  
  describe('generateDOMSource', () => {

    before(function() {
      jsdomify.create()
    })

    after(function() {
      jsdomify.destroy()
    })
   
    it('generateSources should return component sources', function() {
      
      let DOMSource = recycle.generateDOMSource({})
      
      expect(typeof DOMSource).to.equal('function')
      expect(typeof DOMSource().events).to.equal('function')
      expect(DOMSource().events('click') instanceof Observable).to.equal(true)
    })
  })
  
});
