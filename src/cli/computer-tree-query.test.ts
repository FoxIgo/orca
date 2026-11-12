import { describe, expect, it } from 'vitest'
import { isComputerTreeElementDisabled, queryComputerTreeText } from './computer-tree-query'

const TREE = [
  'App=com.apple.TextEdit (pid 96320)',
  'Window: "Untitled", App: TextEdit.',
  '',
  '0 standard window Untitled',
  '\t1 scroll area, Secondary Actions: scroll up, scroll down',
  '\t\t2 text entry area (settable) base zed',
  '\t21 container Formatting',
  '\t\t22 checkbox bold, Value: 0',
  '\t\t23 checkbox italic, Value: 0',
  '',
  'The focused UI element is 2 text entry area (settable) base zed.'
].join('\n')

describe('queryComputerTreeText', () => {
  it('caps the printed elements with maxElements and says how many were left out', () => {
    expect(queryComputerTreeText(TREE, { maxElements: 2 })).toBe(
      [
        'App=com.apple.TextEdit (pid 96320)',
        'Window: "Untitled", App: TextEdit.',
        '',
        'Showing the first 2 of 6 elements.',
        '0 standard window Untitled',
        '\t1 scroll area, Secondary Actions: scroll up, scroll down',
        '',
        'The focused UI element is 2 text entry area (settable) base zed.'
      ].join('\n')
    )
  })

  it('says when nothing matches instead of printing an empty tree', () => {
    expect(queryComputerTreeText(TREE, { query: 'underline' })).toContain(
      '\n\nNo elements match "underline".\n\nThe focused UI element is'
    )
  })
})

describe('isComputerTreeElementDisabled', () => {
  it.each([
    ['12 (disabled) File', true],
    ['\t3 push button (selected, disabled, settable) Save', true],
    ['4 action (primary) (disabled) Continue', true],
    ['5 push button (selected) Save (beta)', false],
    ['6 push button Continue, Description: Next step', false]
  ])('reads %s as disabled=%s', (line, disabled) => {
    expect(isComputerTreeElementDisabled({ index: 0, depth: 0, lines: [line] })).toBe(disabled)
  })
})
