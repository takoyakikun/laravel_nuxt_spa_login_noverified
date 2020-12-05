<?php

return [
    // 権限レベル
    'roleLevel' => [
        'auth' => [
            'system' => 1,  // 開発者
            'admin' => 5,   // 管理者
            'user' => 20,   // 一般
        ]
    ],
    // 権限
    'role' => [
        1 => ['auth' => 'system'], // 開発者
        2 => ['auth' => 'admin'],  // 管理者
        3 => ['auth' => 'user'],   // 一般
    ],
    // 権限の選択オプション
    'roleOptions' => [
        1 => '開発者',
        2 => '管理者',
        3 => '一般',
    ]
];
