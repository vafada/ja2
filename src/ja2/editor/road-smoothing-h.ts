namespace ja2 {
  // There are the 32 macro definitions that make up all of the road pieces.  These enumerations
  // match up exactly to the previous road system order of graphics (FIRSTROAD1 - FIRSTROAD32)
  export const enum Enum54 {
    L1, // left 1 -- this is a left straight-away edge
    R1, // right 1
    B1, // bottom 1
    T1, // top 1
    TTR, // top top-right corner piece (the top part of the top-right corner)
    BTR, // bottom top-right corner piece (the bottom part of the top-right corner)
    LBL, // left bottom-left corner piece
    RBL, // right bottom-left corner piece
    LTL, // left top-left corner piece
    RTL, // right top-left corner piece
    RBR, // right bottom-right corner piece
    LBR, // left bottom-right corner piece
    L2, // left 2  (variation of the left 1)
    R2, // right 2
    L3, // left 3
    R3, // right 3
    B2, // bottom 2
    T2, // top 2
    B3, // bottom 3
    T3, // top 3
    BI, // bottom intersection (piece connecting bottom to right)
    LI, // left intersection		(piece connecting left to bottom )
    TI, // top intersection		(piece connecting top to left)
    RI, // right intersection  (piece connection right to top)
    L4, // left 4
    R4, // right 4
    B4, // bottom 4
    T4, // top 4
    RE, // right edge (end of road)
    LE, // left edge
    BE, // bottom edge
    TE, // top edge
    NUM_ROAD_MACROS,
  }
}
