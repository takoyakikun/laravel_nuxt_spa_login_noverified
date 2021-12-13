<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Gate;

class StoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        // 管理者以上を許可
        if (Gate::allows('admin-higher')) {
            return true;
        }
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'login_id' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'role' => ['required', 'numeric', Rule::in(array_keys(config('role.role')))],
        ];
    }
}
