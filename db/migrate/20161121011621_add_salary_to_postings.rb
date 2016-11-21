class AddSalaryToPostings < ActiveRecord::Migration[5.0]
  def change
    add_column :postings, :employer, :string
    add_column :postings, :salary, :string
    add_column :postings, :schedule, :string
    add_column :postings, :date_to_remove, :datetime
    add_column :postings, :date_posted, :datetime
    add_column :postings, :jobbank_id, :string, index: true
  end
end