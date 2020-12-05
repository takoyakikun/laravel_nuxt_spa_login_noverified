<?php

namespace Tests\Unit\Requests;

use App\Http\Requests\UserStoreRequest;
use App\Models\User;

use Tests\TestCase;
use Illuminate\Support\Facades\Validator;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UserStoreRequestTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    public function setUp(): void
    {
        parent::setUp();

        // テストユーザ作成
        $this->user = factory(User::class)->create([
            'email' => 'test@test.com',
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
        $request  = new UserStoreRequest();
        $rules    = $request->rules();
        $rule     = \Arr::only($rules, $item);

        $dataList = [$item => $data];

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
            'email_true' => ['email', 'test_validation@test.com', true],
            'email_required_null' => ['email', null, false],
            'email_required_empty' => ['email', '', false],
            'email_email' => ['email', 'test', false],
            'email_max_false' => ['email', str_repeat('a', 247) . '@test.com', false],
            'email_max_true' => ['email', str_repeat('a', 246) . '@test.com', true],
            'email_unique' => ['email', 'test@test.com', false],

            // 権限
            'role_true' => ['role', 1, true],
            'role_required_null' => ['role', null, false],
            'role_required_empty' => ['role', '', false],
            'role_numeric_string' => ['role', 'test', false],

        ];
    }
}
