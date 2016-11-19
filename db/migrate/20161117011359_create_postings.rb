class CreatePostings < ActiveRecord::Migration[5.0]
  def change
    create_table :postings do |t|
      t.string :title
      t.text :description
      t.float :latitude, index: true
      t.float :longitude, index: true
      t.string :address
      t.string :phone
      t.string :email
      t.string :source

      t.timestamps
    end
  end
end
