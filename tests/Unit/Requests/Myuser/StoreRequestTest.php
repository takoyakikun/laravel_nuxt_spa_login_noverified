<?php

namespace Tests\Unit\Requests\Myuser;

use App\Http\Requests\Myuser\StoreRequest;
use App\Models\User;

use Tests\TestCase;
use Illuminate\Support\Facades\Validator;
use Illuminate\Foundation\Testing\RefreshDatabase;

class StoreRequestTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    public function setUp(): void
    {
        parent::setUp();

        // テストユーザ作成
        $this->user = factory(User::class)->create([
            'login_id' => 'test@test.com',
        ]);

    }

    /**
     * バリデーションテスト
     *
     * @param string $item
     * @param string $data
     * @param bool $expect
     * @param array $options
     * @return void
     * @dataProvider dataprovider
     */
    public function testValidation($item, $data, $expect, $options = array()): void
    {
        $request  = new StoreRequest();
        $rules    = $request->rules();
        $rule     = \Arr::only($rules, $item);

        $dataList = [$item => $data];
        if ($item === 'password') {
            // 確認パスワードを入力状態にする
            if (isset($options['confirmed'])) {
                $dataList['password_confirmation'] = $options['confirmed'];
            } else {
                $dataList['password_confirmation'] = $data;
            }
        }

        $validator = Validator::make($dataList, $rule);
        $result    = $validator->passes();

        $this->assertEquals($expect, $result);
    }

    /**
     * dataprovider
     *
     * @return array
     */
    public function dataprovider(): array
    {
        return [
            // ユーザー名
            'name_true' => ['name', 'テスト', true],
            'name_required_null' => ['name', null, false],
            'name_required_empty' => ['name', '', false],
            'name_max_false' => ['name', str_repeat('a', 256), false],
            'name_max_true' => ['name', str_repeat('a', 255), true],

            // メールアドレス
            'login_id_true' => ['login_id', 'test_validation@test.com', true],
            'login_id_required_null' => ['login_id', null, false],
            'login_id_required_empty' => ['login_id', '', false],
            'login_id_email' => ['login_id', 'test', false],
            'login_id_max_false' => ['login_id', str_repeat('a', 247) . '@test.com', false],
            'login_id_max_true' => ['login_id', str_repeat('a', 246) . '@test.com', true],
            'login_id_unique' => ['login_id', 'test@test.com', false],

            // パスワード
            'password_true' => ['password', 'password', true],
            'password_required_null' => ['password', null, false],
            'password_required_empty' => ['password', '', false],
            'password_confirmed' => ['password', 'password', false, ['confirmed' => 'confirmed']],
            'password_min_false' => ['password', str_repeat('a', 7), false],
            'password_min_true' => ['password', str_repeat('a', 8), true],
        ];
    }

}
