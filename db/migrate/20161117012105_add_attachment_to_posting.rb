class AddAttachmentToPosting < ActiveRecord::Migration[5.0]
  def up
    add_attachment :postings, :photo
  end

  def down
    remove_attachment :postings, :photo
  end
end
