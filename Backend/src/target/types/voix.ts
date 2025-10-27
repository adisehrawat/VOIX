/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/voix.json`.
 */
export type Voix = {
  "address": "DgCkfcZY1GJkLZd5htKob4XDorcpmnP9UP4f6kXo8Up7",
  "metadata": {
    "name": "voix",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "initializeConfig",
      "docs": [
        "Instruction to initialize the platform's global configuration (only admin)"
      ],
      "discriminator": [
        208,
        127,
        21,
        1,
        194,
        190,
        196,
        70
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "globalConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initializeUser",
      "docs": [
        "Instruction for a new user to create their on-chain UserAccount PDA"
      ],
      "discriminator": [
        111,
        17,
        185,
        250,
        60,
        122,
        38,
        254
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "user",
          "writable": true
        },
        {
          "name": "userAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "mintMilestoneNft",
      "docs": [
        "Instruction for a user to mint a milestone NFT (e.g., \"Bronze Badge\")"
      ],
      "discriminator": [
        13,
        9,
        43,
        63,
        136,
        223,
        110,
        16
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "userAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "mintAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  105,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "mint",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "metadataAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  116,
                  97,
                  100,
                  97,
                  116,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "tokenMetadataProgram"
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "account",
              "path": "tokenMetadataProgram"
            }
          }
        },
        {
          "name": "masterEditionAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  116,
                  97,
                  100,
                  97,
                  116,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "tokenMetadataProgram"
              },
              {
                "kind": "account",
                "path": "mint"
              },
              {
                "kind": "const",
                "value": [
                  101,
                  100,
                  105,
                  116,
                  105,
                  111,
                  110
                ]
              }
            ],
            "program": {
              "kind": "account",
              "path": "tokenMetadataProgram"
            }
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "tokenMetadataProgram",
          "docs": [
            "The Metaplex Token Metadata Program."
          ],
          "address": "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
        }
      ],
      "args": [
        {
          "name": "milestoneLevel",
          "type": "u8"
        },
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "symbol",
          "type": "string"
        },
        {
          "name": "uri",
          "type": "string"
        }
      ]
    },
    {
      "name": "submitMerkleRoot",
      "docs": [
        "Instruction for the admin (backend) to submit the latest Merkle root of all off-chain content (posts, comments, etc.)"
      ],
      "discriminator": [
        191,
        196,
        3,
        78,
        21,
        12,
        96,
        228
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true,
          "relations": [
            "globalConfig"
          ]
        },
        {
          "name": "globalConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "merkleRoot",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "epoch",
          "type": "u64"
        }
      ]
    },
    {
      "name": "tipUserSol",
      "docs": [
        "Instruction for a user to tip another user with native SOL."
      ],
      "discriminator": [
        239,
        233,
        131,
        3,
        126,
        235,
        78,
        245
      ],
      "accounts": [
        {
          "name": "tipper",
          "writable": true,
          "signer": true
        },
        {
          "name": "receiver",
          "docs": [
            "checking it against the `receiver_account` PDA."
          ],
          "writable": true
        },
        {
          "name": "receiverAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "receiver"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "tipUserSpl",
      "docs": [
        "Instruction for a user to tip another user with any SPL Token (e.g., USDC)."
      ],
      "discriminator": [
        135,
        148,
        107,
        138,
        222,
        156,
        33,
        183
      ],
      "accounts": [
        {
          "name": "tipper",
          "writable": true,
          "signer": true
        },
        {
          "name": "receiver"
        },
        {
          "name": "receiverAccount",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "receiver"
              }
            ]
          }
        },
        {
          "name": "mint"
        },
        {
          "name": "tipperTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "tipper"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "receiverTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "receiver"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateUserKarma",
      "docs": [
        "Instruction for the admin (backend) to update a user's on-chain karma score."
      ],
      "discriminator": [
        180,
        9,
        120,
        194,
        10,
        140,
        159,
        10
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true,
          "relations": [
            "globalConfig"
          ]
        },
        {
          "name": "globalConfig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "userAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "userToUpdate"
              }
            ]
          }
        },
        {
          "name": "userToUpdate",
          "docs": [
            "It's not a signer, just an address used to find the `user_account` PDA."
          ]
        }
      ],
      "args": [
        {
          "name": "newKarma",
          "type": "u32"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "globalConfig",
      "discriminator": [
        149,
        8,
        156,
        202,
        160,
        252,
        176,
        217
      ]
    },
    {
      "name": "userAccount",
      "discriminator": [
        211,
        33,
        136,
        16,
        186,
        110,
        242,
        127
      ]
    }
  ],
  "events": [
    {
      "name": "karmaUpdated",
      "discriminator": [
        95,
        138,
        225,
        85,
        101,
        112,
        95,
        121
      ]
    },
    {
      "name": "merkleRootSubmitted",
      "discriminator": [
        185,
        69,
        218,
        17,
        200,
        145,
        187,
        77
      ]
    },
    {
      "name": "milestoneNftMinted",
      "discriminator": [
        78,
        190,
        147,
        17,
        196,
        105,
        166,
        191
      ]
    },
    {
      "name": "userInitialized",
      "discriminator": [
        66,
        195,
        5,
        223,
        42,
        84,
        135,
        60
      ]
    },
    {
      "name": "userTipped",
      "discriminator": [
        113,
        249,
        216,
        10,
        22,
        173,
        217,
        246
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "unauthorized",
      "msg": "You are not authorized to perform this action."
    },
    {
      "code": 6001,
      "name": "invalidTipAmount",
      "msg": "Tip amount must be greater than 0."
    },
    {
      "code": 6002,
      "name": "mathOverflow",
      "msg": "Math overflow occurred."
    },
    {
      "code": 6003,
      "name": "insufficientKarma",
      "msg": "You do not have enough karma for this milestone."
    },
    {
      "code": 6004,
      "name": "milestoneAlreadyMinted",
      "msg": "You have already minted this milestone NFT."
    },
    {
      "code": 6005,
      "name": "invalidMilestoneLevel",
      "msg": "The milestone level specified is invalid."
    },
    {
      "code": 6006,
      "name": "invalidEpoch",
      "msg": "The provided Merkle epoch is not sequential."
    }
  ],
  "types": [
    {
      "name": "globalConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "docs": [
              "The public key of your backend server.",
              "This is the *only* key allowed to update karma or submit a new Merkle root.",
              "SET ONCE by: `initialize_config` instruction."
            ],
            "type": "pubkey"
          },
          {
            "name": "merkleRoot",
            "docs": [
              "The 32-byte Merkle root hash of all off-chain content (posts/comments).",
              "UPDATED BY BACKEND using: `submit_merkle_root` instruction."
            ],
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "epoch",
            "docs": [
              "A simple counter to track the current Merkle root version.",
              "UPDATED BY BACKEND using: `submit_merkle_root` instruction."
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "karmaUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "newKarma",
            "type": "u32"
          },
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "merkleRootSubmitted",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "merkleRoot",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "epoch",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "milestoneNftMinted",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "nftMint",
            "type": "pubkey"
          },
          {
            "name": "milestoneLevel",
            "type": "u8"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "userAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "userPubkey",
            "docs": [
              "The user's wallet address.",
              "SET ONCE by: `initialize_user` instruction."
            ],
            "type": "pubkey"
          },
          {
            "name": "karma",
            "docs": [
              "The user's karma score.",
              "This value is read from your off-chain 'Karma' table (`Karma.points`).",
              "UPDATED BY BACKEND using: `update_user_karma` instruction."
            ],
            "type": "u32"
          },
          {
            "name": "mintedMilestones",
            "docs": [
              "A bit-flag to track which milestone NFTs the user has already claimed.",
              "This prevents double-minting.",
              "(e.g., 1 = Bronze, 2 = Silver, 4 = Gold)",
              "UPDATED BY PROGRAM during: `mint_milestone_nft` instruction."
            ],
            "type": "u8"
          },
          {
            "name": "totalSolTipped",
            "docs": [
              "A simple counter for total SOL received from tips.",
              "This is purely on-chain and not synced from your backend.",
              "UPDATED BY PROGRAM during: `tip_user_sol` instruction."
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "userInitialized",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "userTipped",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tipper",
            "type": "pubkey"
          },
          {
            "name": "receiver",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "mint",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    }
  ],
  "constants": [
    {
      "name": "bronzeKarmaReq",
      "type": "u32",
      "value": "1000"
    },
    {
      "name": "bronzeMilestoneFlag",
      "type": "u8",
      "value": "1"
    },
    {
      "name": "configSeed",
      "type": "bytes",
      "value": "[99, 111, 110, 102, 105, 103]"
    },
    {
      "name": "goldKarmaReq",
      "type": "u32",
      "value": "10000"
    },
    {
      "name": "goldMilestoneFlag",
      "type": "u8",
      "value": "4"
    },
    {
      "name": "mintAuthoritySeed",
      "type": "bytes",
      "value": "[109, 105, 110, 116, 95, 97, 117, 116, 104, 111, 114, 105, 116, 121]"
    },
    {
      "name": "silverKarmaReq",
      "type": "u32",
      "value": "5000"
    },
    {
      "name": "silverMilestoneFlag",
      "type": "u8",
      "value": "2"
    },
    {
      "name": "userSeed",
      "type": "bytes",
      "value": "[117, 115, 101, 114]"
    }
  ]
};
