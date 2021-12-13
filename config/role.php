<?php

// ユーザー権限の設定
return [
    // 権限レベル(数字が小さいほど強い)
    'roleLevel' => [
        // ページ全体
        'auth' => [
            'system' => 1,  // 開発者
            'admin' => 5,   // 管理者
            'user' => 20,   // 一般
        ]
    ],
    // ユーザー権限
    'role' => [
        1 => ['name' => '開発者', 'level' => ['auth' => 'system']], // 開発者
        2 => ['name' => '管理者', 'level' => ['auth' => 'admin']],  // 管理者
        3 => ['name' => '一般', 'level' => ['auth' => 'user']],     // 一般
    ],
];
