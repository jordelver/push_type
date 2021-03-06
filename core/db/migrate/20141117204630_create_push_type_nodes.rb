class CreatePushTypeNodes < ActiveRecord::Migration
  def change
    enable_extension 'uuid-ossp' unless extension_enabled?('uuid-ossp')
    create_table :push_type_nodes, id: :uuid, default: 'uuid_generate_v4()' do |t|
      t.string    :type
      t.string    :title
      t.string    :slug
      t.json      :field_store

      t.uuid      :parent_id
      t.integer   :sort_order

      t.integer   :status
      t.datetime  :published_at
      t.datetime  :published_to

      t.uuid      :creator_id
      t.uuid      :updater_id

      t.timestamps
      t.datetime  :deleted_at
    end
  end
end
