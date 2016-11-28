class AddScopeToPostings < ActiveRecord::Migration[5.0]
  def change
    add_column :postings, :scope, :string, default: 'jobs'
  end
end
