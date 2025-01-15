<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    public function run()
    {
        Permission::create(['name' => 'view_roles', 'guard_name' => 'web']);
        Permission::create(['name' => 'create_roles', 'guard_name' => 'web']);
        Permission::create(['name' => 'edit_roles', 'guard_name' => 'web']);
        Permission::create(['name' => 'delete_roles', 'guard_name' => 'web']);
        Permission::create(['name' => 'view_permissions']);
        Permission::create(['name' => 'view_users']);
        Permission::create(['name' => 'view_subjects']);
        Permission::create(['name' => 'view_rewards']);
        Permission::create(['name' => 'view_golds']);
        Permission::create(['name' => 'view_product_golds']);
        Permission::create(['name' => 'view_units']);
        // ... tambahkan permission lainnya
    }
}
