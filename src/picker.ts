import type HashRing from 'hashring'
import { loadPackageOnce } from './loadPackage'

/**
 * Picker interface, a picker can pick a node by key
 */
interface Picker<T> {
  pick(key: string): T
}

/**
 * SimplePicker is abstrcat class with simple node manage
 * should impl pick method yourself
 */
export abstract class SimplePicker<T> implements Picker<T> {
  protected nodeList: T[]
  protected len: number = 0

  constructor(nodeList: T[]) {
    this.setNodes(nodeList)
  }

  setNodes(nodeList: T[]) {
    this.nodeList = nodeList
    this.len = this.nodeList.length
  }

  abstract pick(key: string): T
}

/**
 * RandomPicker always pick a random node
 */
export class RandomPicker<T> extends SimplePicker<T> {
  pick(key: string): T {
    const rand = Math.floor(Math.random() * this.len)
    return this.nodeList[rand]
  }
}

/**
 * RoundRobinPicker always pick node by order loop
 */
export class RoundRobinPicker<T> extends SimplePicker<T> {
  private _priIndex = 0

  override setNodes(nodeList: T[]) {
    super.setNodes(nodeList)
    this._priIndex = 0
  }

  pick(key: string): T {
    if (this._priIndex === this.len) {
      this._priIndex = 0
    }
    return this.nodeList[this._priIndex++]
  }
}

/**
 * HashPicker pick a node with key hash index,
 * should impl hash method yourself
 */
export abstract class HashPicker<T> extends SimplePicker<T> {
  abstract hash(key: string): number

  pick(key: string): T {
    return this.nodeList[this.hash(key) % this.len]
  }
}

/**
 * Crc32HashPicker impl HashPicker.hash with crc32 hash
 */
export class Crc32HashPicker<T> extends HashPicker<T> {
  private readonly crc32: any
  constructor(nodeList: T[]) {
    super(nodeList)
    this.crc32 = loadPackageOnce('buffer-crc32', 'Crc32HashPicker')
  }

  hash(key: string): number {
    return this.crc32.unsigned(Buffer.from(key))
  }
}

/**
 * Node is node type for ConsistentHashPicker
 */
export interface Node<T> {
  id: string
  node: T
  weight?: number
  vnodes?: number
}

/**
 * ConsistentHashPicker is also a hash picker, but using
 * consistent hash
 */
export class ConsistentHashPicker<T> implements Picker<T> {
  private nodeMap = new Map<string, T>()
  private ring: HashRing

  constructor(nodes: Node<T>[]) {
    this.setNodes(nodes)
  }

  setNodes(nodes: Node<T>[]) {
    // clean previous ring
    if (this.ring) {
      this.ring.end()
    }

    const servers: HashRing.Servers = {}
    for (const node of nodes) {
      this.nodeMap.set(node.id, node.node)
      servers[node.id] = { weight: node.weight, vnodes: node.vnodes }
    }

    const HashRing = loadPackageOnce('hashring', 'ConsistentHashPicker')

    this.ring = new HashRing(servers)
  }

  pick(key: string): T {
    const nodeKey = this.ring.get(key)
    return this.nodeMap.get(nodeKey)
  }
}
