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
            'login_id' => 'sample@test.com',
            'role' => 1
        ]);

        // コマンドを実行
        $this->artisan('command:user-delete', [
            'login_id' => $sample->login_id,
        ])->expectsOutput($sample->name. '(' . $sample->login_id . ') を削除しました。');

        // ユーザーが削除されているか確認
        $this->assertDeleted($sample);

    }
}
