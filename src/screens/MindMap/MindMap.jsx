import { useRef, useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Text, StatusBar, TextInput } from 'react-native'
import { WebView } from 'react-native-webview'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../context/ThemeContext'
import { supabase } from '../../../lib/supabase'

export default function MindMap({ navigation, route }) {
  const { bg, textColor, subColor, accent, cardBg } = useTheme()
  const webRef = useRef(null)
  const [title, setTitle] = useState(route?.params?.note?.title || '')
  const [saving, setSaving] = useState(false)
  const existingNote = route?.params?.note

  const save = async (mindmapData) => {
    setSaving(true)
    const payload = {
      title: title.trim() || 'Sin título',
      type: 'mindmap',
      mindmap_data: mindmapData,
      updated_at: new Date().toISOString(),
      folder_id: route?.params?.folderId || null,
    }
    if (existingNote?.id) {
      await supabase.from('notes').update(payload).eq('id', existingNote.id)
    } else {
      await supabase.from('notes').insert(payload)
    }
    setSaving(false)
    navigation.goBack()
  }

  const handleMessage = (event) => {
    const data = JSON.parse(event.nativeEvent.data)
    if (data.type === 'save') save(data.payload)
  }

  const triggerSave = () => {
    webRef.current?.injectJavaScript('window.getSaveData(); true;')
  }

  const initialData = existingNote?.mindmap_data
    ? JSON.stringify(existingNote.mindmap_data)
    : 'null'

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  body { background: #111; overflow: hidden; width: 100vw; height: 100vh; font-family: -apple-system, sans-serif; }
  canvas { display: block; touch-action: none; }

  #topic-input-wrap {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    display: flex; flex-direction: column; align-items: center; gap: 12px;
  }
  #topic-input {
    background: #00C896; border: none; border-radius: 12px;
    padding: 16px 32px; font-size: 16px; font-weight: 600;
    color: #111; outline: none; text-align: center;
    width: 220px;
  }
  #topic-input::placeholder { color: #0a5c46; }

  /* Color picker */
  #color-picker {
    position: absolute; bottom: 80px; left: 50%;
    transform: translateX(-50%);
    background: #1e1e1e; border-radius: 16px;
    padding: 12px 16px; display: none;
    flex-direction: row; gap: 10px; align-items: center;
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    z-index: 100;
  }
  #color-picker.visible { display: flex; }
  .color-swatch {
    width: 32px; height: 32px; border-radius: 50%;
    cursor: pointer; border: 2px solid transparent;
    transition: transform 0.1s;
  }
  .color-swatch:active { transform: scale(1.2); }
  .color-swatch.active { border-color: #fff; }

  /* Shape picker */
  #shape-picker {
    position: absolute; bottom: 80px; left: 50%;
    transform: translateX(-50%);
    background: #1e1e1e; border-radius: 16px;
    padding: 12px 16px; display: none;
    flex-direction: row; gap: 10px; align-items: center;
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    z-index: 100;
  }
  #shape-picker.visible { display: flex; }
  .shape-btn {
    width: 40px; height: 40px; display: flex;
    align-items: center; justify-content: center;
    background: #2a2a2a; border-radius: 8px;
    cursor: pointer; border: 2px solid transparent;
  }
  .shape-btn.active { border-color: #00C896; }
  .shape-btn svg { width: 22px; height: 22px; }

  /* Edge style picker */
  #edge-picker {
    position: absolute; bottom: 80px; left: 50%;
    transform: translateX(-50%);
    background: #1e1e1e; border-radius: 16px;
    padding: 12px 16px; display: none;
    flex-direction: column; gap: 10px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    z-index: 100; min-width: 200px;
  }
  #edge-picker.visible { display: flex; }
  .edge-style-btn {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 12px; border-radius: 8px;
    background: #2a2a2a; cursor: pointer;
    border: 2px solid transparent; color: #fff; font-size: 13px;
  }
  .edge-style-btn.active { border-color: #00C896; }
  .thickness-row {
    display: flex; align-items: center; gap: 8px;
    justify-content: space-between; padding: 4px 0;
  }
  .thick-btn {
    width: 32px; height: 32px; background: #2a2a2a;
    border-radius: 8px; color: #fff; font-size: 18px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; border: none;
  }
  #thickness-val { color: #fff; font-size: 14px; min-width: 20px; text-align: center; }
</style>
</head>
<body>

<canvas id="c"></canvas>

<!-- Topic input inicial -->
<div id="topic-input-wrap">
  <input id="topic-input" placeholder="Enter topic" autofocus />
</div>

<!-- Color picker -->
<div id="color-picker">
  <div class="color-swatch" style="background:#FFB300" data-color="#FFB300"></div>
  <div class="color-swatch" style="background:#FF5252" data-color="#FF5252"></div>
  <div class="color-swatch" style="background:#00C896" data-color="#00C896"></div>
  <div class="color-swatch" style="background:#4A9EFF" data-color="#4A9EFF"></div>
  <div class="color-swatch" style="background:#C77DFF" data-color="#C77DFF"></div>
  <div class="color-swatch" style="background:#FF6EC7" data-color="#FF6EC7"></div>
  <div class="color-swatch" style="background:#00E5FF" data-color="#00E5FF"></div>
</div>

<!-- Shape picker -->
<div id="shape-picker">
  <div class="shape-btn" data-shape="rect">
    <svg viewBox="0 0 22 22"><rect x="2" y="5" width="18" height="12" rx="3" fill="none" stroke="#fff" stroke-width="2"/></svg>
  </div>
  <div class="shape-btn" data-shape="circle">
    <svg viewBox="0 0 22 22"><circle cx="11" cy="11" r="8" fill="none" stroke="#fff" stroke-width="2"/></svg>
  </div>
  <div class="shape-btn" data-shape="hexagon">
    <svg viewBox="0 0 22 22"><polygon points="11,2 19,6.5 19,15.5 11,20 3,15.5 3,6.5" fill="none" stroke="#fff" stroke-width="2"/></svg>
  </div>
  <div class="shape-btn" data-shape="diamond">
    <svg viewBox="0 0 22 22"><polygon points="11,2 20,11 11,20 2,11" fill="none" stroke="#fff" stroke-width="2"/></svg>
  </div>
  <div class="shape-btn" data-shape="triangle">
    <svg viewBox="0 0 22 22"><polygon points="11,2 20,20 2,20" fill="none" stroke="#fff" stroke-width="2"/></svg>
  </div>
</div>

<!-- Edge style picker -->
<div id="edge-picker">
  <div class="edge-style-btn" data-style="straight">
    <svg width="40" height="16" viewBox="0 0 40 16"><line x1="0" y1="8" x2="40" y2="8" stroke="#fff" stroke-width="2"/></svg>
    Recta
  </div>
  <div class="edge-style-btn" data-style="curved">
    <svg width="40" height="16" viewBox="0 0 40 16"><path d="M0,14 Q20,-2 40,14" fill="none" stroke="#fff" stroke-width="2"/></svg>
    Curva
  </div>
  <div class="edge-style-btn" data-style="dashed">
    <svg width="40" height="16" viewBox="0 0 40 16"><line x1="0" y1="8" x2="40" y2="8" stroke="#fff" stroke-width="2" stroke-dasharray="6,4"/></svg>
    Punteada
  </div>
  <div class="thickness-row">
    <button class="thick-btn" id="thick-minus">−</button>
    <span id="thickness-val">2</span>
    <button class="thick-btn" id="thick-plus">+</button>
  </div>
</div>

<script>
const canvas = document.getElementById('c')
const ctx    = canvas.getContext('2d')
canvas.width  = window.innerWidth
canvas.height = window.innerHeight

// ── State ──
let nodes = []
let edges = []
let selectedNode = null
let selectedEdge = null
let dragging     = null
let dragOffX     = 0, dragOffY = 0
let dragCtrl     = null   // { edgeId, startX, startY }
let panStart     = null
let viewX = 0, viewY = 0
let activePicker = null   // 'color' | 'shape' | 'edge' | null
let uid = 1
let topicDone = false

const COLORS = ['#FFB300','#FF5252','#00C896','#4A9EFF','#C77DFF','#FF6EC7','#00E5FF']

// ── Init from existing data ──
const initData = ${initialData}
if (initData && initData.nodes && initData.nodes.length > 0) {
  nodes = initData.nodes
  edges = initData.edges || []
  uid   = Math.max(...nodes.map(n => n.id)) + 1
  topicDone = true
  document.getElementById('topic-input-wrap').style.display = 'none'
  draw()
}

// ── Helpers ──
function getNode(id) { return nodes.find(n => n.id === id) }
function getEdge(id) { return edges.find(e => e.id === id) }

function worldToScreen(wx, wy) {
  return { x: wx + viewX, y: wy + viewY }
}
function screenToWorld(sx, sy) {
  return { x: sx - viewX, y: sy - viewY }
}

// ── Node geometry ──
function nodeHitTest(node, sx, sy) {
  const { x: nx, y: ny } = worldToScreen(node.x, node.y)
  const hw = node.w / 2, hh = node.h / 2
  switch (node.shape) {
    case 'circle':
      return Math.hypot(sx - nx, sy - ny) <= hw + 4
    default:
      return sx >= nx - hw - 4 && sx <= nx + hw + 4 && sy >= ny - hh - 4 && sy <= ny + hh + 4
  }
}

function drawNode(node) {
  const { x: sx, y: sy } = worldToScreen(node.x, node.y)
  const hw = node.w / 2, hh = node.h / 2
  const isSelected = selectedNode === node.id

  ctx.save()
  if (isSelected) {
    ctx.shadowColor = '#fff'
    ctx.shadowBlur  = 10
  }

  ctx.fillStyle = node.color
  ctx.beginPath()

  switch (node.shape) {
    case 'circle':
      ctx.arc(sx, sy, hw + 4, 0, Math.PI * 2)
      break
    case 'hexagon': {
      const r = hw + 8
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 6
        i === 0 ? ctx.moveTo(sx + r * Math.cos(a), sy + r * Math.sin(a))
                : ctx.lineTo(sx + r * Math.cos(a), sy + r * Math.sin(a))
      }
      ctx.closePath()
      break
    }
    case 'diamond': {
      const r = hw + 10
      ctx.moveTo(sx,       sy - r)
      ctx.lineTo(sx + r,   sy)
      ctx.lineTo(sx,       sy + r)
      ctx.lineTo(sx - r,   sy)
      ctx.closePath()
      break
    }
    case 'triangle': {
      const r = hw + 10
      ctx.moveTo(sx,                 sy - r)
      ctx.lineTo(sx + r * 0.866,     sy + r * 0.5)
      ctx.lineTo(sx - r * 0.866,     sy + r * 0.5)
      ctx.closePath()
      break
    }
    default:
      roundRect(ctx, sx - hw, sy - hh, node.w, node.h, 10)
  }

  ctx.fill()

  if (isSelected) {
    ctx.shadowBlur = 0
    ctx.strokeStyle = '#fff'
    ctx.lineWidth   = 2.5
    ctx.stroke()
  }

  ctx.restore()

  // texto
  const lum = luminance(node.color)
  ctx.fillStyle = lum > 0.4 ? '#111' : '#fff'
  ctx.font = 'bold 13px -apple-system, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  wrapText(ctx, node.text || '', sx, sy, node.w - 10, 16)
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function wrapText(ctx, text, x, y, maxW, lineH) {
  const words = text.split(' ')
  let line = ''
  const lines = []
  for (const word of words) {
    const test = line ? line + ' ' + word : word
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line); line = word
    } else { line = test }
  }
  if (line) lines.push(line)
  const startY = y - ((lines.length - 1) * lineH) / 2
  lines.forEach((l, i) => ctx.fillText(l, x, startY + i * lineH))
}

function luminance(hex) {
  const r = parseInt(hex.slice(1,3),16)/255
  const g = parseInt(hex.slice(3,5),16)/255
  const b = parseInt(hex.slice(5,7),16)/255
  return 0.299*r + 0.587*g + 0.114*b
}

// ── Edge ──
function edgeControlPoint(edge) {
  const from = getNode(edge.fromId)
  const to   = getNode(edge.toId)
  if (!from || !to) return null
  const mx = (from.x + to.x) / 2 + (edge.controlOffsetX || 0)
  const my = (from.y + to.y) / 2 + (edge.controlOffsetY || 0)
  return { x: mx, y: my }
}

function drawEdge(edge) {
  const from = getNode(edge.fromId)
  const to   = getNode(edge.toId)
  if (!from || !to) return

  const s1 = worldToScreen(from.x, from.y)
  const s2 = worldToScreen(to.x, to.y)
  const cp = edgeControlPoint(edge)
  const sc = worldToScreen(cp.x, cp.y)

  const isSelected = selectedEdge === edge.id

  ctx.save()
  ctx.strokeStyle = isSelected ? '#fff' : edge.color
  ctx.lineWidth   = isSelected ? edge.thickness + 1 : edge.thickness
  if (edge.style === 'dashed') ctx.setLineDash([8, 5])
  else ctx.setLineDash([])

  ctx.beginPath()
  if (edge.style === 'curved') {
    ctx.moveTo(s1.x, s1.y)
    ctx.quadraticCurveTo(sc.x, sc.y, s2.x, s2.y)
  } else {
    ctx.moveTo(s1.x, s1.y)
    ctx.lineTo(s2.x, s2.y)
  }
  ctx.stroke()

  // control point handle
  if (isSelected && edge.style === 'curved') {
    ctx.setLineDash([])
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.arc(sc.x, sc.y, 7, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 1.5
    ctx.stroke()
  }

  // hit area midpoint indicator cuando seleccionada
  if (isSelected) {
    const mx = (s1.x + s2.x) / 2
    const my = (s1.y + s2.y) / 2
    ctx.setLineDash([])
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.arc(mx, my, 5, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.restore()
}

function edgeHitTest(edge, sx, sy) {
  const from = getNode(edge.fromId)
  const to   = getNode(edge.toId)
  if (!from || !to) return false
  const s1 = worldToScreen(from.x, from.y)
  const s2 = worldToScreen(to.x, to.y)
  // sample puntos a lo largo de la línea
  for (let t = 0; t <= 1; t += 0.05) {
    const px = s1.x + (s2.x - s1.x) * t
    const py = s1.y + (s2.y - s1.y) * t
    if (Math.hypot(sx - px, sy - py) < 10) return true
  }
  return false
}

// ── Draw ──
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  edges.forEach(drawEdge)
  nodes.forEach(drawNode)
}

// ── Topic input ──
const topicInput = document.getElementById('topic-input')
const topicWrap  = document.getElementById('topic-input-wrap')

topicInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && topicInput.value.trim()) {
    createRoot(topicInput.value.trim())
  }
})
topicInput.addEventListener('blur', () => {
  if (topicInput.value.trim()) createRoot(topicInput.value.trim())
})

function createRoot(text) {
  topicDone = true
  topicWrap.style.display = 'none'
  const cx = canvas.width  / 2 - viewX
  const cy = canvas.height / 2 - viewY
  nodes.push({ id: uid++, text, x: cx, y: cy, color: '#00C896', shape: 'rect', w: 140, h: 48 })
  selectedNode = nodes[0].id
  draw()
}

// ── Add node ──
function addNode() {
  if (!selectedNode) return
  const parent = getNode(selectedNode)
  if (!parent) return
  const siblings = nodes.filter(n => n.parentId === parent.id).length
  const angle = (siblings * 65 - 30) * (Math.PI / 180)
  const r = 200
  const newNode = {
    id: uid++,
    text: '',
    x: parent.x + r * Math.cos(angle),
    y: parent.y + r * Math.sin(angle),
    color: parent.color,
    shape: parent.shape,
    w: 120, h: 44,
    parentId: parent.id,
  }
  const newEdge = {
    id: uid++,
    fromId: parent.id,
    toId:   newNode.id,
    color:  parent.color,
    style:  'curved',
    thickness: 2,
    controlOffsetX: 0,
    controlOffsetY: 0,
  }
  nodes.push(newNode)
  edges.push(newEdge)
  selectedNode = newNode.id
  selectedEdge = null
  draw()
  // abrir edición de texto
  openTextEdit(newNode)
}

// ── Text edit overlay ──
let editingNode = null
function openTextEdit(node) {
  editingNode = node
  const s = worldToScreen(node.x, node.y)
  const inp = document.createElement('input')
  inp.value = node.text
  inp.style.cssText = \`
    position:absolute; left:\${s.x - node.w/2}px; top:\${s.y - 16}px;
    width:\${node.w}px; height:32px;
    background:transparent; border:none; outline:none;
    color:\${luminance(node.color) > 0.4 ? '#111':'#fff'};
    font:bold 13px -apple-system,sans-serif;
    text-align:center; z-index:200;
  \`
  document.body.appendChild(inp)
  inp.focus()
  inp.select()
  const commit = () => {
    node.text = inp.value
    document.body.removeChild(inp)
    editingNode = null
    draw()
  }
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') commit() })
  inp.addEventListener('blur', commit)
}

// ── Delete ──
function deleteSelected() {
  if (selectedEdge) {
    edges = edges.filter(e => e.id !== selectedEdge)
    selectedEdge = null
    draw(); return
  }
  if (selectedNode) {
    // eliminar recursivamente
    const toDelete = new Set()
    const queue = [selectedNode]
    while (queue.length) {
      const id = queue.shift()
      toDelete.add(id)
      nodes.forEach(n => { if (n.parentId === id) queue.push(n.id) })
    }
    nodes = nodes.filter(n => !toDelete.has(n.id))
    edges = edges.filter(e => !toDelete.has(e.fromId) && !toDelete.has(e.toId))
    selectedNode = null
    if (nodes.length === 0) {
      topicDone = false
      topicWrap.style.display = 'flex'
      topicInput.value = ''
      topicInput.focus()
    }
    draw()
  }
}

// ── Pickers ──
function closePickers() {
  document.getElementById('color-picker').classList.remove('visible')
  document.getElementById('shape-picker').classList.remove('visible')
  document.getElementById('edge-picker').classList.remove('visible')
  activePicker = null
}

function toggleColorPicker() {
  if (activePicker === 'color') { closePickers(); return }
  closePickers()
  // marcar color activo
  const currentColor = selectedNode
    ? getNode(selectedNode)?.color
    : selectedEdge ? getEdge(selectedEdge)?.color : null
  document.querySelectorAll('.color-swatch').forEach(el => {
    el.classList.toggle('active', el.dataset.color === currentColor)
  })
  document.getElementById('color-picker').classList.add('visible')
  activePicker = 'color'
}

function toggleShapePicker() {
  if (selectedEdge) {
    if (activePicker === 'edge') { closePickers(); return }
    closePickers()
    const edge = getEdge(selectedEdge)
    document.querySelectorAll('.edge-style-btn').forEach(el => {
      el.classList.toggle('active', el.dataset.style === edge?.style)
    })
    document.getElementById('thickness-val').textContent = edge?.thickness || 2
    document.getElementById('edge-picker').classList.add('visible')
    activePicker = 'edge'
  } else if (selectedNode) {
    if (activePicker === 'shape') { closePickers(); return }
    closePickers()
    const node = getNode(selectedNode)
    document.querySelectorAll('.shape-btn').forEach(el => {
      el.classList.toggle('active', el.dataset.shape === node?.shape)
    })
    document.getElementById('shape-picker').classList.add('visible')
    activePicker = 'shape'
  }
}

// color swatches
document.querySelectorAll('.color-swatch').forEach(el => {
  el.addEventListener('click', () => {
    const color = el.dataset.color
    if (selectedNode) {
      getNode(selectedNode).color = color
      // actualizar aristas conectadas
      edges.forEach(e => { if (e.fromId === selectedNode || e.toId === selectedNode) e.color = color })
    } else if (selectedEdge) {
      getEdge(selectedEdge).color = color
    }
    closePickers(); draw()
  })
})

// shape buttons
document.querySelectorAll('.shape-btn').forEach(el => {
  el.addEventListener('click', () => {
    if (selectedNode) { getNode(selectedNode).shape = el.dataset.shape }
    closePickers(); draw()
  })
})

// edge style buttons
document.querySelectorAll('.edge-style-btn').forEach(el => {
  el.addEventListener('click', () => {
    if (selectedEdge) { getEdge(selectedEdge).style = el.dataset.style }
    closePickers(); draw()
  })
})

// thickness
document.getElementById('thick-minus').addEventListener('click', () => {
  if (!selectedEdge) return
  const e = getEdge(selectedEdge)
  e.thickness = Math.max(1, (e.thickness || 2) - 1)
  document.getElementById('thickness-val').textContent = e.thickness
  draw()
})
document.getElementById('thick-plus').addEventListener('click', () => {
  if (!selectedEdge) return
  const e = getEdge(selectedEdge)
  e.thickness = Math.min(8, (e.thickness || 2) + 1)
  document.getElementById('thickness-val').textContent = e.thickness
  draw()
})

// ── Touch / Pointer events ──
let lastTap = 0

canvas.addEventListener('pointerdown', e => {
  const sx = e.clientX, sy = e.clientY

  // control point de arista curva
  if (selectedEdge) {
    const edge = getEdge(selectedEdge)
    if (edge?.style === 'curved') {
      const cp = edgeControlPoint(edge)
      const sc = worldToScreen(cp.x, cp.y)
      if (Math.hypot(sx - sc.x, sy - sc.y) < 14) {
        dragCtrl = { edgeId: edge.id, startX: sx, startY: sy, ocx: edge.controlOffsetX || 0, ocy: edge.controlOffsetY || 0 }
        return
      }
    }
  }

  // hit nodo
  for (let i = nodes.length - 1; i >= 0; i--) {
    const node = nodes[i]
    if (nodeHitTest(node, sx, sy)) {
      // doble tap = editar
      const now = Date.now()
      if (now - lastTap < 300 && selectedNode === node.id) {
        openTextEdit(node)
        lastTap = 0; return
      }
      lastTap = now
      selectedNode = node.id
      selectedEdge = null
      closePickers()
      const w = screenToWorld(sx, sy)
      dragging  = node.id
      dragOffX  = node.x - w.x
      dragOffY  = node.y - w.y
      canvas.setPointerCapture(e.pointerId)
      draw(); return
    }
  }

  // hit arista
  for (const edge of edges) {
    if (edgeHitTest(edge, sx, sy)) {
      selectedEdge = edge.id
      selectedNode = null
      closePickers()
      draw(); return
    }
  }

  // canvas vacío → deseleccionar
  selectedNode = null
  selectedEdge = null
  closePickers()

  // pan
  panStart = { x: sx, y: sy, vx: viewX, vy: viewY }
  draw()
})

canvas.addEventListener('pointermove', e => {
  if (dragCtrl) {
    const edge = getEdge(dragCtrl.edgeId)
    if (edge) {
      edge.controlOffsetX = dragCtrl.ocx + (e.clientX - dragCtrl.startX)
      edge.controlOffsetY = dragCtrl.ocy + (e.clientY - dragCtrl.startY)
      draw()
    }
    return
  }
  if (dragging) {
    const w = screenToWorld(e.clientX, e.clientY)
    const node = getNode(dragging)
    if (node) { node.x = w.x + dragOffX; node.y = w.y + dragOffY }
    draw(); return
  }
  if (panStart) {
    viewX = panStart.vx + (e.clientX - panStart.x)
    viewY = panStart.vy + (e.clientY - panStart.y)
    draw()
  }
})

canvas.addEventListener('pointerup', () => {
  dragging  = null
  dragCtrl  = null
  panStart  = null
})

// ── Save ──
window.getSaveData = function() {
  window.ReactNativeWebView.postMessage(JSON.stringify({
    type: 'save',
    payload: { nodes, edges }
  }))
}

draw()
</script>
</body>
</html>
  `

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: bg }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={22} color={textColor} />
        </TouchableOpacity>
        <TextInput
          style={[styles.titleInput, { color: textColor }]}
          placeholder="Título del mapa..."
          placeholderTextColor={subColor}
          value={title}
          onChangeText={setTitle}
        />
        <TouchableOpacity style={styles.headerBtn} onPress={triggerSave}>
          {saving
            ? <Text style={{ color: accent }}>...</Text>
            : <Ionicons name="checkmark" size={24} color={accent} />
          }
        </TouchableOpacity>
      </View>

      {/* WebView Canvas */}
      <WebView
        ref={webRef}
        source={{ html }}
        style={{ flex: 1, backgroundColor: '#111' }}
        onMessage={handleMessage}
        scrollEnabled={false}
        javaScriptEnabled
        originWhitelist={['*']}
      />

      {/* Toolbar */}
      <View style={[styles.toolbar, { backgroundColor: bg, borderTopColor: cardBg }]}>
        {/* Trash */}
        <TouchableOpacity
          style={[styles.toolBtn, { backgroundColor: cardBg }]}
          onPress={() => webRef.current?.injectJavaScript('deleteSelected(); true;')}
        >
          <Ionicons name="trash-outline" size={20} color={textColor} />
        </TouchableOpacity>

        {/* Color */}
        <TouchableOpacity
          style={[styles.toolBtn, { backgroundColor: cardBg }]}
          onPress={() => webRef.current?.injectJavaScript('toggleColorPicker(); true;')}
        >
          <View style={styles.colorCircles}>
            {['#FF5252','#4A9EFF','#00C896','#C77DFF'].map(c => (
              <View key={c} style={[styles.miniDot, { backgroundColor: c }]} />
            ))}
          </View>
        </TouchableOpacity>

        {/* Forma / Estilo */}
        <TouchableOpacity
          style={[styles.toolBtn, { backgroundColor: cardBg }]}
          onPress={() => webRef.current?.injectJavaScript('toggleShapePicker(); true;')}
        >
          <Ionicons name="shapes-outline" size={22} color={textColor} />
        </TouchableOpacity>

        {/* Add */}
        <TouchableOpacity
          style={[styles.toolBtn, { backgroundColor: accent }]}
          onPress={() => webRef.current?.injectJavaScript('addNode(); true;')}
        >
          <Ionicons name="add" size={24} color="#111" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container:    { flex: 1 },
  header:       { flexDirection: 'row', alignItems: 'center', paddingTop: 52, paddingBottom: 12, paddingHorizontal: 8 },
  titleInput:   { flex: 1, fontSize: 16, fontWeight: '600', paddingHorizontal: 8 },
  headerBtn:    { padding: 10, borderRadius: 20 },
  toolbar:      { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 20, borderTopWidth: 1 },
  toolBtn:      { width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center' },
  colorCircles: { flexDirection: 'row', flexWrap: 'wrap', gap: 3, width: 24, height: 24 },
  miniDot:      { width: 9, height: 9, borderRadius: 5 },
})