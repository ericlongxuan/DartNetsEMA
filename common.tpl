<div class="top-content">
  <nav class="navbar navbar-inverse navbar-fixed-top">
    <div class="container-fluid">
      <div class="navbar-header">
        <a class="navbar-brand" href=".">EMA Manager (mVersion: {{mVersion}})</a>
      </div>
      <div class="navbar-collapse collapse">
        <ul class="nav navbar-nav navbar-right">
          <li><a id="load-ema-link" href="#"><i class="glyphicon glyphicon-download-alt"></i>Load EMA</a></li>
          <li><a id="save-ema-link" href="#"><span class="glyphicon glyphicon glyphicon-share"></span>Save EMA</a></li>
        </ul>
      </div>
    </div>
  </nav>
</div>
<!-- alert modal -->
<div class="modal fade alert-modal" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-sm">
    <div class="modal-content">
      <div class="alert alert-danger" role="alert">
        <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
        <span class="alert-message"></span>
      </div>
    </div>
  </div>
</div>
<!-- text input modal -->
<div class="modal fade input-modal" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-large">
    <div class="modal-content">
      <!-- wait js to fill in -->
      <div class="input-block"></div>
      <button type="text" class="btn btn-primary btn-ok">Confirm</button>
      <button type="text" class="btn btn-default btn-cancel">Cancel</button>
    </div>
  </div>
</div>
<!-- load modal -->
<div class="modal fade load-modal" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-large">
    <div class="modal-content">
      <p><span class="label label-info">LOCAL</span></p>
      <span><strong>Select a local file to load: </strong></span>
      <span class="btn btn-primary btn-file">
        Browse <input id="file-path-input" type="file">
      </span>
      
      <hr>
      <p><span class="label label-info">SERVER</span></p>
      <span><strong>Choose a file on server: </strong></span>
      <div class="input-group">
        <select class="form-control">
          <option selected>file1</option>
          <option selected>file2</option>
          <option selected>file3</option>
        </select>
        <button type="button" class="btn btn-primary">Load</button>
      </div>
    </div>
  </div>
</div>