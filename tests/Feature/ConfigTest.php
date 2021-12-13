<?php

namespace Tests\Feature;

use App\Http\Controllers\ConfigController;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ConfigTest extends TestCase
{
    /**
     * コンフィグ取得のテスト
     *
     * @return void
     */
    public function testConfig()
    {
        // テストコンフィグデータ
        $testConfig = [
            // 文字列データ
            'test1' => 'value',
            // 配列データ・配列内文字列データ
            'test2' => [
                1 => 'value1',
                2 => 'value2'
            ],
            // 連想配列データ・配列内文字列データ
            'test3' => [
                'key1' => 'value1',
                'key2' => 'value2'
            ],
            // 配列データ・配列内配列データ
            'test4' => [
                1 => [
                    'value1-1',
                    'value1-2'
                ],
                2 => [
                    'value2-1',
                    'value2-2'
                ]
            ],
            // 配列データ・配列内連想配列データ
            'test5' => [
                1 => [
                    'key1' => 'value1-1',
                    'key2' => 'value1-2',
                ],
                2 => [
                    'key1' => 'value2-1',
                    'key2' => 'value2-2',
                ]
            ],
        ];

        $testHiddenConfig = [
            // 取得しないデータ
            'test6' => 'hidden'
        ];

        // テストコンフィグデータをセット
        \Config::set('settings', $testConfig);
        \Config::set('settings_hidden', $testHiddenConfig);

        // 正しいレスポンスデータ
        $trueResponse = [
            // 文字列データ
            'test1' => 'value',
            // 配列データ・配列内文字列データ
            'test2' => [
                ['value' => 1, 'text' => 'value1'],
                ['value' => 2, 'text' => 'value2'],
            ],
            // 連想配列データ・配列内文字列データ
            'test3' => [
                ['value' => 'key1', 'text' => 'value1'],
                ['value' => 'key2', 'text' => 'value2'],
            ],
            // 配列データ・配列内配列データ
            'test4' => [
                ['value' => 1, 'array' => [
                    'value1-1',
                    'value1-2'
                ]],
                ['value' => 2, 'array' => [
                    'value2-1',
                    'value2-2'
                ]],
            ],
            // 配列データ・配列内連想配列データ
            'test5' => [
                ['value' => 1, 'key1' => 'value1-1', 'key2' => 'value1-2'],
                ['value' => 2, 'key1' => 'value2-1', 'key2' => 'value2-2'],
            ]
        ];

        // コンフィグ取得のリクエストを送信
        $response = $this->json('GET', route('config'), [], ['X-Requested-With' => 'XMLHttpRequest']);

        // 正常のレスポンスが返ってくることを確認
        $response->assertStatus(200);

        // 正しいレスポンスデータが返っているか確認
        $response->assertJson($trueResponse, true);
        $response->assertJsonCount(5);

    }
}
