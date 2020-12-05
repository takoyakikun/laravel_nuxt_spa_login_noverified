<?php

namespace Tests\Feature\Commands;

use App\Models\User;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class UserDeleteTest extends TestCase
{
    use RefreshDatabase;

    /**
     * ログインユーザー削除コマンドテスト
     *
     * @return void
     */
    public function testHandle()
    {
        // サンプルデータを追加
        $sample = factory(User::class)->create([
            'name' => 'テスト',
            'email' => 'sample@test.com',
            'role' => 1
        ]);

        // コマンドを実行
        $this->artisan('command:user-delete', [
            'email' => $sample->email,
        ])->expectsOutput($sample->name. '(' . $sample->email . ') を削除しました。');

        // ユーザーが削除されているか確認
        $this->assertDeleted($sample);

    }
}
