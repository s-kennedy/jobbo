class AddLocationToPostings < ActiveRecord::Migration[5.0]
  def change
    add_column :postings, :latitude, :float
    add_column :postings, :longitude, :float
  end
end
