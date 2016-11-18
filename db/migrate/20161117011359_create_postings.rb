class CreatePostings < ActiveRecord::Migration[5.0]
  def change
    create_table :postings do |t|
      t.string :title
      t.text :description
      t.float :latitute, :index
      t.float :longitute, :index
      t.string :address
      t.string :phone
      t.string :email
      t.string :source

      t.timestamps
    end
  end
end
