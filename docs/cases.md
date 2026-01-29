# Test Cases – Product Barcode Management

## TC-01: Add valid product code
- Input: ABCD1234EFGH5678
- Expected:
  - Auto format to ABCD-1234-EFGH-5678
  - Record added to table
  - Barcode displayed (Code 39)

## TC-02: Invalid product code
- Input: abc-123
- Expected:
  - Show validation error
  - Add button disabled

## TC-03: Delete product
- Action: Click delete → confirm
- Expected:
  - Record removed from table
